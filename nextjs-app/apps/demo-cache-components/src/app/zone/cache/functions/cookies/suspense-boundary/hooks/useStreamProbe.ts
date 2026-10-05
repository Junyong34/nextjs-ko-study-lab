'use client'

import { useCallback, useState } from 'react'
import type { MarkerHit, ProbeTarget, StreamRun } from '../types'
import { DEMO_PATH } from '../lib/constants'
import { clearSessionAction, setSessionAction } from '../actions'

// HTML 속성으로만 매칭한다 — RSC 인라인 스크립트 안의 값은 \" 로 이스케이프돼 걸리지 않는다.
const MARKERS = {
  static: 'data-demo-marker="static"',
  fallback: 'data-demo-marker="fallback"',
  session: 'data-demo-marker="session"',
} as const
type MarkerKey = keyof typeof MARKERS

const pick = (html: string, attr: string) => new RegExp(`${attr}="([^"]+)"`).exec(html)?.[1] ?? null

/**
 * 하위 라우트(inside / outside)의 HTML 응답 스트림을 청크 단위로 읽어 각 마커가 처음 도착한 청크와 시각을 기록한다.
 * cookieSent는 Server Action이 돌려준 값으로만 갱신한다. 브라우저가 httpOnly 쿠키를 직접 읽을 수 없기 때문이다.
 */
export function useStreamProbe() {
  const [runs, setRuns] = useState<StreamRun[]>([])
  const [running, setRunning] = useState<ProbeTarget | null>(null)
  const [cookieSent, setCookieSent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const probe = useCallback(
    async (target: ProbeTarget) => {
      setRunning(target)
      setError(null)
      try {
        const t0 = performance.now()
        const res = await fetch(`${DEMO_PATH}/${target}`, { headers: { accept: 'text/html' }, credentials: 'same-origin' })
        const headersMs = Math.round(performance.now() - t0)
        if (!res.body) throw new Error('응답 body 스트림이 없습니다.')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let html = ''
        let chunk = 0
        const found: Record<MarkerKey, MarkerHit | null> = { static: null, fallback: null, session: null }
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          chunk += 1
          html += decoder.decode(value, { stream: true })
          const ms = Math.round(performance.now() - t0)
          for (const key of Object.keys(MARKERS) as MarkerKey[]) {
            const offset = found[key] ? -1 : html.indexOf(MARKERS[key])
            if (offset >= 0) found[key] = { chunk, ms, offset }
          }
        }
        // 스트리밍된 Suspense 콘텐츠는 문서 뒤쪽 <div hidden id="S:n"> 안에 실려 오고 $RC 스크립트가 fallback 자리와 교체한다.
        const segmentStart = found.session ? html.lastIndexOf('<div hidden id="S:', found.session.offset) : -1
        const run: Omit<StreamRun, 'runNo'> = {
          target,
          cookieSent,
          status: res.status,
          headersMs,
          totalMs: Math.round(performance.now() - t0),
          totalChunks: chunk,
          staticAt: found.static,
          fallbackAt: found.fallback,
          sessionAt: found.session,
          sessionUser: pick(html, 'data-session-user'),
          sessionInStreamSegment: segmentStart >= 0 && found.fallback !== null && segmentStart > found.fallback.offset,
        }
        setRuns((prev) => [...prev, { ...run, runNo: (prev.at(-1)?.runNo ?? 0) + 1 }].slice(-10))
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setRunning(null)
      }
    },
    [cookieSent],
  )

  const issueCookie = useCallback(async () => setCookieSent(await setSessionAction()), [])
  const removeCookie = useCallback(async () => {
    await clearSessionAction()
    setCookieSent(null)
  }, [])
  const reset = useCallback(async () => {
    await removeCookie()
    setRuns([])
    setError(null)
  }, [removeCookie])

  return { runs, running, cookieSent, error, probe, issueCookie, removeCookie, reset }
}
