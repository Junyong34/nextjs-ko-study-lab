'use client'

import { useEffect, useState } from 'react'
import type { RscEntry } from '../types'

const DEST_MARK = '/custom-prefetch-false/dest/'

function toEntry(entry: PerformanceEntry): RscEntry | null {
  const name = entry.name
  const idx = name.indexOf(DEST_MARK)
  // 라우터의 RSC 요청(prefetch·이동 모두)은 ?_rsc= 쿼리를 단 fetch로 나간다.
  if (idx === -1 || !name.includes('_rsc=')) return null
  const id = name.slice(idx + DEST_MARK.length).split(/[/?#]/)[0]
  const timing = entry as PerformanceResourceTiming
  return { id, startTime: timing.startTime, responseEnd: timing.responseEnd, transferSize: timing.transferSize }
}

/**
 * 브라우저 Resource Timing 버퍼에 실제로 기록된 목적지 RSC 요청만 모은다.
 * 버퍼는 문서 단위라 soft navigation 사이에도 누적되며, 새로고침하면 비워진다.
 */
export function useRscEntries(): RscEntry[] {
  const [entries, setEntries] = useState<RscEntry[]>([])

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return
    const collect = () =>
      performance
        .getEntriesByType('resource')
        .map(toEntry)
        .filter((e): e is RscEntry => e !== null)
    setEntries(collect())
    const observer = new PerformanceObserver(() => setEntries(collect()))
    observer.observe({ type: 'resource' })
    return () => observer.disconnect()
  }, [])

  return entries
}

/** 한 목적지 id에 대해 클릭 전(prefetch) / 클릭 후(이동 요청)로 나눈다. */
export function splitByClick(entries: RscEntry[], id: string, clickAt: number | null) {
  const mine = entries.filter((e) => e.id === id)
  if (clickAt === null) return { before: mine, after: [] as RscEntry[] }
  return { before: mine.filter((e) => e.startTime < clickAt), after: mine.filter((e) => e.startTime >= clickAt) }
}
