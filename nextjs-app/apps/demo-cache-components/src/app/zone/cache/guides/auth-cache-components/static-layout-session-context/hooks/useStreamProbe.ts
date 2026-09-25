'use client'

import { useCallback, useState } from 'react'
import type { MarkerHit, StreamProbeRun } from '../types'

// HTML 속성으로만 매칭한다 — RSC 인라인 스크립트 안의 값은 \" 로 이스케이프돼 걸리지 않는다.
const MARKERS = {
  shell: 'data-demo-marker="catalog-shell"',
  fallback: 'data-demo-marker="session-fallback"',
  session: 'data-demo-marker="session-ready"',
} as const

function pick(html: string, attr: string): string | null {
  return new RegExp(`${attr}="([^"]+)"`).exec(html)?.[1] ?? null
}

/**
 * 현재 페이지 URL을 fetch해 초기 HTML 응답 스트림을 청크 단위로 읽는다.
 * 각 마커가 몇 번째 청크, 몇 ms에 처음 도착했는지 기록한다 (브라우저 쿠키 포함).
 */
export function useStreamProbe() {
  const [runs, setRuns] = useState<StreamProbeRun[]>([])
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const probe = useCallback(async () => {
    setRunning(true)
    setError(null)
    try {
      const t0 = performance.now()
      const res = await fetch(window.location.pathname, {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { accept: 'text/html' },
      })
      if (!res.body) throw new Error('응답 body 스트림이 없습니다.')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let html = ''
      let chunk = 0
      const found: Record<keyof typeof MARKERS, MarkerHit | null> = {
        shell: null,
        fallback: null,
        session: null,
      }
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        chunk += 1
        html += decoder.decode(value, { stream: true })
        const ms = Math.round(performance.now() - t0)
        for (const key of Object.keys(MARKERS) as (keyof typeof MARKERS)[]) {
          const offset = found[key] ? -1 : html.indexOf(MARKERS[key])
          if (offset >= 0) found[key] = { chunk, ms, offset }
        }
      }
      // 스트리밍된 Suspense 콘텐츠는 문서 뒤쪽 <div hidden id="S:n"> 안에 실려 오고
      // $RC 스크립트가 fallback 자리(<template id="B:n">)와 교체한다.
      const segmentStart = found.session ? html.lastIndexOf('<div hidden id="S:', found.session.offset) : -1
      const sessionInStreamSegment =
        segmentStart >= 0 && found.fallback !== null && segmentStart > found.fallback.offset
      const run: Omit<StreamProbeRun, 'runNo'> = {
        status: res.status,
        totalChunks: chunk,
        totalMs: Math.round(performance.now() - t0),
        shellAt: found.shell,
        fallbackAt: found.fallback,
        sessionAt: found.session,
        sessionInStreamSegment,
        shellRenderId: pick(html, 'data-shell-render-id'),
        sessionRequestId: pick(html, 'data-session-request-id'),
        sessionUser: pick(html, 'data-session-user'),
      }
      setRuns((prev) => [...prev, { ...run, runNo: (prev.at(-1)?.runNo ?? 0) + 1 }].slice(-6))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }, [])

  const reset = useCallback(() => {
    setRuns([])
    setError(null)
  }, [])

  return { runs, running, error, probe, reset }
}
