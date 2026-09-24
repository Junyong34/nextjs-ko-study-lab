'use client'

import { useState } from 'react'
import { BASE_PATH, ORIGIN_LATENCY_MS } from '../tags'
import type { InvalidateResult, MeasureRun, ProbeResult, ProfileId } from '../types'

async function readJson<T>(res: Response): Promise<T> {
  const body = await res.json()
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${body?.error ?? '요청 실패'}`)
  return body as T
}

/** GET probe: 같은 'use cache' 엔트리를 읽는 실제 서버 요청 (브라우저 캐시 우회) */
const probe = (id: ProfileId) =>
  fetch(`${BASE_PATH}/probe?profile=${id}&t=${Date.now()}`, { cache: 'no-store' }).then((r) => readJson<ProbeResult>(r))

/** POST invalidate: Route Handler에서 원본 변경 + revalidateTag(tag, profile) */
const invalidate = (id: ProfileId) =>
  fetch(`${BASE_PATH}/invalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile: id }),
  }).then((r) => readJson<InvalidateResult>(r))

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** 1회차가 stale 값을 받았다면 백그라운드 재계산(원본 지연 600ms)이 끝날 시간을 둔 뒤 2회차를 보낸다 */
export const SECOND_REQUEST_GAP_MS = ORIGIN_LATENCY_MS + 400

/** 기준 요청 → 무효화 → (선택한 시간만큼 실제 대기) → 1회차 요청 → (1초) → 2회차 요청을 순서대로 보내고 응답을 기록한다 */
export function useMeasureRun() {
  const [runs, setRuns] = useState<MeasureRun[]>([])
  const [busy, setBusy] = useState(false)

  const patch = (id: number, next: Partial<MeasureRun>) =>
    setRuns((rs) => rs.map((r) => (r.id === id ? { ...r, ...next } : r)))

  const measure = async (profileId: ProfileId, delaySec: number) => {
    const id = Date.now()
    setBusy(true)
    setRuns((rs) => [{ id, profileId, delaySec, phase: 'before' as const }, ...rs].slice(0, 8))
    try {
      const before = await probe(profileId)
      patch(id, { before, phase: 'invalidate' })
      const invalidation = await invalidate(profileId)
      patch(id, { invalidation, phase: delaySec > 0 ? 'wait' : 'first' })
      if (delaySec > 0) {
        await wait(delaySec * 1000)
        patch(id, { phase: 'first' })
      }
      const first = await probe(profileId)
      patch(id, { first, phase: 'second' })
      await wait(SECOND_REQUEST_GAP_MS)
      const second = await probe(profileId)
      patch(id, { second, phase: 'done' })
    } catch (e) {
      patch(id, { error: e instanceof Error ? e.message : String(e), phase: 'done' })
    } finally {
      setBusy(false)
    }
  }

  return { runs, busy, measure, clear: () => setRuns([]) }
}
