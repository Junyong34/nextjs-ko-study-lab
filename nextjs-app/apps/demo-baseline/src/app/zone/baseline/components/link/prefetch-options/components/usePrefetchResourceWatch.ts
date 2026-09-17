'use client'

import { useEffect, useRef, useState } from 'react'
import type { PrefetchResourceEntry, PrefetchVariant } from '../types'

const TARGET_PATH_SEGMENT = '/components/link/prefetch-options/target/'

function extractVariant(url: string): PrefetchVariant | null {
  const idx = url.indexOf(TARGET_PATH_SEGMENT)
  if (idx === -1) return null
  const rest = url.slice(idx + TARGET_PATH_SEGMENT.length)
  const segment = rest.split(/[/?#]/)[0]
  return segment === 'auto' || segment === 'full' || segment === 'false' ? segment : null
}

/**
 * 브라우저가 실제로 발생시킨 리소스 요청(performance resource timing)만 관찰한다.
 * next/link의 prefetch가 만드는 요청은 내부적으로 fetch()를 호출하므로
 * initiatorType이 'fetch'인 resource 엔트리로 그대로 잡힌다 — 텍스트 시뮬레이션이 아니다.
 */
export function usePrefetchResourceWatch() {
  const [entries, setEntries] = useState<PrefetchResourceEntry[]>([])
  const seenKeys = useRef(new Set<string>())

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      const additions: PrefetchResourceEntry[] = []
      for (const entry of list.getEntries()) {
        const resourceEntry = entry as PerformanceResourceTiming
        const variant = extractVariant(resourceEntry.name)
        if (!variant) continue

        const key = `${resourceEntry.name}@${resourceEntry.startTime}`
        if (seenKeys.current.has(key)) continue
        seenKeys.current.add(key)

        additions.push({
          variant,
          url: resourceEntry.name,
          transferSize: resourceEntry.transferSize,
          encodedBodySize: resourceEntry.encodedBodySize,
          initiatorType: resourceEntry.initiatorType,
          startTime: resourceEntry.startTime,
        })
      }
      if (additions.length > 0) {
        setEntries((prev) => [...prev, ...additions])
      }
    })

    observer.observe({ type: 'resource', buffered: true })
    return () => observer.disconnect()
  }, [])

  const reset = () => {
    seenKeys.current.clear()
    setEntries([])
  }

  return { entries, reset }
}
