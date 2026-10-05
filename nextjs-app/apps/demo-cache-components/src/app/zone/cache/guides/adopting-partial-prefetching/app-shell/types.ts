export type LinkGroup = 'partial-default' | 'legacy-default' | 'partial-full' | 'partial-disabled'

/** window.fetch를 감싸 잡아낸 RSC 요청 한 건 (`RSC: 1` 헤더가 있는 요청만) */
export interface RscRequest {
  id: number
  kind: 'prefetch' | 'navigation'
  /** `_rsc` 쿼리를 뺀 pathname */
  path: string
  /** `Next-Router-Prefetch` 요청 헤더 값 */
  prefetchHeader: string | null
  /** `Next-Router-Segment-Prefetch` 요청 헤더 값 (세그먼트 단위 prefetch) */
  segmentPrefetch: string | null
  startedAt: number
  status: number | null
  headersMs: number | null
}
