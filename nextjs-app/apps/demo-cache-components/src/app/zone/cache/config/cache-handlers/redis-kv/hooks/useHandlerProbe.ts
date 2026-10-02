'use client'
import { useRef, useState } from 'react'
import { PROBE_PATH, type ProbeBody, type ProbeRecord } from '../types'

/** 측정 기록이 "같은 프로세스 메모리에서 hit → 무효화 → 재계산 → hit" 순서를 보였는지 판정한다. */
export function judgeRecords(records: ProbeRecord[]): boolean | undefined {
  // 무효화 없이 cacheId가 바뀐 읽기나 다른 PID의 응답이 있으면 기대와 다르다 (프로세스 재시작·HMR·다른 인스턴스 등).
  const unexpectedChange = records.some((r, i) => r.kind === 'read' && r.phase === 'recomputed' && records[i - 1]?.kind === 'read')
  if (unexpectedChange || new Set(records.map((r) => r.instance.pid)).size > 1) return false

  // 기대 순서: hit → 무효화 → recomputed → hit
  const isRead = (phase: string) => (r: ProbeRecord) => r.kind === 'read' && r.phase === phase
  const completed = records.some((r, k) => {
    if (r.kind !== 'invalidate' || !records.slice(0, k).some(isRead('hit'))) return false
    const after = records.slice(k)
    const recomputedAt = after.findIndex(isRead('recomputed'))
    return recomputedAt >= 0 && after.slice(recomputedAt).some(isRead('hit'))
  })
  return completed ? true : undefined
}

export function useHandlerProbe() {
  const [records, setRecords] = useState<ProbeRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const seqRef = useRef(0)

  async function call(method: 'GET' | 'POST') {
    setIsPending(true)
    const seq = ++seqRef.current
    try {
      // cache: 'no-store'는 쓰지 않는다. 그러면 브라우저가 Cache-Control: no-cache 요청 헤더를 붙이고,
      // next dev는 그 헤더가 있는 요청에서 'use cache'를 다시 계산한다. 회차 번호로 브라우저 HTTP 캐시만 피한다.
      const res = await fetch(`${PROBE_PATH}?round=${seq}`, { method })
      const body = (await res.json()) as ProbeBody
      if (!body.ok) throw new Error(body.error)
      setRecords((prev) => {
        if (body.op === 'invalidate') return [...prev, { seq, kind: 'invalidate', tag: body.tag, instance: body.instance, servedAt: body.servedAt }]
        const lastRead = [...prev].reverse().find((r) => r.kind === 'read')
        const phase = !lastRead ? 'first' : lastRead.snapshot.cacheId === body.snapshot.cacheId ? 'hit' : 'recomputed'
        return [...prev, { seq, kind: 'read', snapshot: body.snapshot, instance: body.instance, servedAt: body.servedAt, phase }]
      })
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsPending(false)
    }
  }

  // 화면 기록만 지운다. 서버 메모리의 캐시 엔트리는 그대로 남아 있으므로 다음 첫 읽기는 기존 값을 돌려줄 수 있다.
  const clear = () => {
    setRecords([])
    setError(null)
    seqRef.current = 0
  }

  return {
    records,
    error,
    isPending,
    read: () => call('GET'),
    invalidate: () => call('POST'),
    clear,
    matched: judgeRecords(records),
  }
}

export type HandlerProbeState = ReturnType<typeof useHandlerProbe>
