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

/** 도착지 페이지의 영역. A 고정, B 긴 stale 캐시, B2 짧은 stale 캐시, C URL별, D 실시간 */
export type Area = 'A' | 'B' | 'B2' | 'C' | 'D'
export const AREAS: Area[] = ['A', 'B', 'B2', 'C', 'D']

export type RouteKind = 'partial' | 'legacy' | 'cold'
export type LinkKind = 'default' | 'prefetch' | 'false'

/** 한 번의 클릭과, 그 뒤 각 영역이 화면에 마운트된 시각(ms, 클릭 기준) */
export interface ClickRun {
  runNo: number
  route: RouteKind
  link: LinkKind
  id: string
  arrivals: Partial<Record<Area, number>>
}

export interface Check {
  label: string
  expected: string
  actual: string
  ok: boolean
  /** 환경 때문에 비교할 수 없어 판정에서 뺀 항목 */
  skipped?: boolean
}
