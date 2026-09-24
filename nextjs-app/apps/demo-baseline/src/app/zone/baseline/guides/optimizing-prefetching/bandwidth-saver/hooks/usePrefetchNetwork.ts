'use client'

import { useEffect, useRef, useState } from 'react'
import { MODE_KEYS, parseItemUrl } from '../catalog'
import type { ModeNetworkStats, PrefetchMode } from '../types'

type NetworkByMode = Record<PrefetchMode, ModeNetworkStats>

function emptyStats(): NetworkByMode {
  return Object.fromEntries(
    MODE_KEYS.map((k) => [k, { requests: 0, transferBytes: 0, bodyBytes: 0, skus: 0 }]),
  ) as NetworkByMode
}

/**
 * 브라우저가 실제로 기록한 Resource Timing 엔트리만 집계한다.
 * 목적지(item/{mode}/{sku})로 향한 `?_rsc=` fetch만 골라 모드별 요청 수와 transferSize 합을 낸다.
 * 이 페이지가 마운트된 이후의 요청만 센다 — 카탈로그에 머무는 동안 발생한 요청은 모두 prefetch다.
 */
export function usePrefetchNetwork(): NetworkByMode {
  const [stats, setStats] = useState<NetworkByMode>(emptyStats)
  const seen = useRef(new Set<PerformanceEntry>())
  const skusByMode = useRef(new Map<PrefetchMode, Set<string>>())

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return
    const mountedAt = performance.now()
    // 링크 96개 + 청크 요청으로 기본 버퍼(250건)가 차지 않도록 넉넉히 늘린다.
    performance.setResourceTimingBufferSize?.(2000)

    const scan = (entries: PerformanceEntryList) => {
      const next: Partial<Record<PrefetchMode, ModeNetworkStats>> = {}
      for (const raw of entries) {
        const entry = raw as PerformanceResourceTiming
        if (entry.startTime < mountedAt || seen.current.has(entry)) continue
        if (!entry.name.includes('_rsc=')) continue
        const parsed = parseItemUrl(entry.name)
        if (!parsed) continue
        seen.current.add(entry)

        const skus = skusByMode.current.get(parsed.mode) ?? new Set<string>()
        skus.add(parsed.sku)
        skusByMode.current.set(parsed.mode, skus)

        const acc = next[parsed.mode] ?? { requests: 0, transferBytes: 0, bodyBytes: 0, skus: 0 }
        acc.requests += 1
        acc.transferBytes += entry.transferSize
        acc.bodyBytes += entry.encodedBodySize
        next[parsed.mode] = acc
      }
      const changed = Object.keys(next) as PrefetchMode[]
      if (changed.length === 0) return
      setStats((prev) => {
        const merged = { ...prev }
        for (const mode of changed) {
          const add = next[mode]!
          merged[mode] = {
            requests: prev[mode].requests + add.requests,
            transferBytes: prev[mode].transferBytes + add.transferBytes,
            bodyBytes: prev[mode].bodyBytes + add.bodyBytes,
            skus: skusByMode.current.get(mode)?.size ?? 0,
          }
        }
        return merged
      })
    }

    const observer = new PerformanceObserver((list) => scan(list.getEntries()))
    observer.observe({ type: 'resource', buffered: true })
    return () => observer.disconnect()
  }, [])

  return stats
}
