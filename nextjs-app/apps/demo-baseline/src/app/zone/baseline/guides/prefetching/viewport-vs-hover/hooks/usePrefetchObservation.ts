'use client'

import { useEffect, useRef, useState } from 'react'
import type { PrefetchCounts } from '../types'

interface UsePrefetchObservationArgs {
  autoHref: string
  disabledHref: string
}

/**
 * 브라우저가 실제로 기록한 Resource Timing 항목(`performance.getEntriesByType('resource')`)만
 * 집계한다. 타이머나 가짜 상태로 prefetch 발생 여부를 흉내 내지 않는다 — Next.js가 실제로
 * 보낸 `?_rsc=` 요청만 카운트한다.
 */
export function usePrefetchObservation({
  autoHref,
  disabledHref,
}: UsePrefetchObservationArgs): PrefetchCounts {
  const [counts, setCounts] = useState<PrefetchCounts>({ autoCount: 0, disabledCount: 0 })
  const seenRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return

    const scan = (entries: PerformanceEntryList) => {
      let autoDelta = 0
      let disabledDelta = 0

      for (const entry of entries) {
        const name = entry.name
        if (!name.includes('_rsc=') || seenRef.current.has(name)) continue
        seenRef.current.add(name)
        if (name.includes(autoHref)) autoDelta += 1
        if (name.includes(disabledHref)) disabledDelta += 1
      }

      if (autoDelta || disabledDelta) {
        setCounts((prev) => ({
          autoCount: prev.autoCount + autoDelta,
          disabledCount: prev.disabledCount + disabledDelta,
        }))
      }
    }

    // 옵저버 연결 전에 이미 발생한 요청(초기 로드 시점의 뷰포트 자동 prefetch)까지 포함한다.
    scan(performance.getEntriesByType('resource'))

    const observer = new PerformanceObserver((list) => scan(list.getEntries()))
    observer.observe({ type: 'resource', buffered: true })
    return () => observer.disconnect()
  }, [autoHref, disabledHref])

  return counts
}
