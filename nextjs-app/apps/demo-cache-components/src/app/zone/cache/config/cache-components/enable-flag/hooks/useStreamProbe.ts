'use client'

import { useCallback, useState } from 'react'
import type { MarkerHit, ProbeTarget, StreamRun } from '../types'
import { DEMO_PATH } from '../lib/routes'

// HTML 속성으로만 매칭한다 — RSC 인라인 스크립트 안의 값은 \" 로 이스케이프돼 걸리지 않는다.
const MARKERS = {
  static: 'data-demo-marker="probe-static"',
  cached: 'data-demo-marker="probe-cached"',
  fallback: 'data-demo-marker="probe-fallback"',
  request: 'data-demo-marker="probe-request"',
} as const

type MarkerKey = keyof typeof MARKERS

function pick(html: string, attr: string): string | null {
  return new RegExp(`${attr}="([^"]+)"`).exec(html)?.[1] ?? null
}

/**
 * 하위 라우트(probe / blocking)의 HTML 응답 스트림을 청크 단위로 읽어
 * 각 마커가 몇 번째 청크, 몇 ms에 처음 도착했는지 기록한다.
 *
 * fetch의 cache 옵션은 일부러 기본값으로 둔다. 'no-store'는 브라우저가
 * Cache-Control: no-cache 요청 헤더를 붙이는데, dev 서버는 그 헤더가 있으면
 * 'use cache'를 건너뛰고 다시 계산한다(실측). 응답 자체가 no-cache라 브라우저 캐시는 쓰이지 않는다.
 */
export function useStreamProbe() {
  const [runs, setRuns] = useState<StreamRun[]>([])
  const [running, setRunning] = useState<ProbeTarget | null>(null)
  const [error, setError] = useState<string | null>(null)

  const probe = useCallback(async (target: ProbeTarget) => {
    setRunning(target)
    setError(null)
    try {
      const t0 = performance.now()
      const res = await fetch(`${DEMO_PATH}/${target}`, { headers: { accept: 'text/html' } })
      const headersMs = Math.round(performance.now() - t0)
      if (!res.body) throw new Error('응답 body 스트림이 없습니다.')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let html = ''
      let chunk = 0
      const found: Record<MarkerKey, MarkerHit | null> = {
        static: null,
        cached: null,
        fallback: null,
        request: null,
      }
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
      // 스트리밍된 Suspense 콘텐츠는 문서 뒤쪽 <div hidden id="S:n"> 안에 실려 오고
      // $RC 스크립트가 fallback 자리(<template id="B:n">)와 교체한다.
      const segmentStart = found.request ? html.lastIndexOf('<div hidden id="S:', found.request.offset) : -1
      const run: Omit<StreamRun, 'runNo'> = {
        target,
        status: res.status,
        headersMs,
        totalMs: Math.round(performance.now() - t0),
        totalChunks: chunk,
        staticAt: found.static,
        cachedAt: found.cached,
        fallbackAt: found.fallback,
        requestAt: found.request,
        requestInStreamSegment:
          segmentStart >= 0 && found.fallback !== null && segmentStart > found.fallback.offset,
        cachedId: pick(html, 'data-cached-id'),
        requestId: pick(html, 'data-request-id'),
      }
      setRuns((prev) => [...prev, { ...run, runNo: (prev.at(-1)?.runNo ?? 0) + 1 }].slice(-8))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(null)
    }
  }, [])

  const reset = useCallback(() => {
    setRuns([])
    setError(null)
  }, [])

  return { runs, running, error, probe, reset }
}
