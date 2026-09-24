import { DEST_IDS, laneOf, type LaneKey, type NavMeasurement, type RscEntry, type ServerCounts } from '../types'
import { splitByClick } from '../hooks/useRscEntries'

export interface LaneSummary {
  /** 첫 클릭 이전에 발생한 목적지 RSC 요청 수 (= prefetch) */
  prefetchRequests: number
  prefetchBytes: number
  /** prefetch 요청이 있었던 링크 수 */
  prefetchedLinks: number
  layoutRenders: number
  pageRenders: number
}

export interface MeasurementRow extends NavMeasurement {
  lane: LaneKey
  before: number
  after: number
  loadingMs: number | null
  contentMs: number
}

const firstClickAt = (measurements: NavMeasurement[], id: string) => {
  const hit = measurements.find((m) => m.id === id)
  return hit ? hit.clickAt : null
}

export function summarizeLanes(entries: RscEntry[], measurements: NavMeasurement[], counts: ServerCounts) {
  const result = {} as Record<LaneKey, LaneSummary>
  for (const id of DEST_IDS) {
    const lane = laneOf(id)
    const row = (result[lane] ??= { prefetchRequests: 0, prefetchBytes: 0, prefetchedLinks: 0, layoutRenders: 0, pageRenders: 0 })
    const { before } = splitByClick(entries, id, firstClickAt(measurements, id))
    row.prefetchRequests += before.length
    row.prefetchBytes += before.reduce((sum, e) => sum + e.transferSize, 0)
    if (before.length > 0) row.prefetchedLinks += 1
    row.layoutRenders += counts[id]?.layout ?? 0
    row.pageRenders += counts[id]?.page ?? 0
  }
  return result
}

export function toRows(entries: RscEntry[], measurements: NavMeasurement[]): MeasurementRow[] {
  return measurements.map((m) => {
    const { before, after } = splitByClick(entries, m.id, m.clickAt)
    return {
      ...m,
      lane: laneOf(m.id),
      before: before.length,
      after: after.filter((e) => e.startTime <= m.contentAt).length,
      loadingMs: m.loadingAt === null ? null : m.loadingAt - m.clickAt,
      contentMs: m.contentAt - m.clickAt,
    }
  })
}
