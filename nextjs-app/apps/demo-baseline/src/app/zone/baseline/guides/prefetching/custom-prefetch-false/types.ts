export const DEMO_BASE = '/zone/baseline/guides/prefetching/custom-prefetch-false'
export const STATS_URL = `${DEMO_BASE}/stats`

/** 목적지 layout.tsx(loading 경계 위)가 서버에서 기다리는 시간 — "비싼 공통 조회"의 대역 */
export const LAYOUT_COST_MS = 400
/** 목적지 page.tsx(loading 경계 아래)가 서버에서 기다리는 시간 — 요청마다 새로 읽는 동적 데이터 */
export const PAGE_COST_MS = 700

export type LaneKey = 'a' | 'b' | 'c' | 'd'

export interface LaneConfig {
  key: LaneKey
  title: string
  code: string
  note: string
}

export const LANES: LaneConfig[] = [
  { key: 'a', title: '기본 <Link>', code: '<Link href>', note: '뷰포트 진입 즉시 prefetch' },
  { key: 'b', title: 'NoPrefetchLink', code: '<Link prefetch={false}>', note: '뷰포트·hover 모두 prefetch 안 함' },
  { key: 'c', title: 'HoverPrefetchLink', code: 'prefetch={active ? null : false}', note: 'hover한 링크만 prefetch' },
  { key: 'd', title: 'router.prefetch()', code: 'onMouseEnter → router.prefetch(href)', note: 'hover 시 수동 prefetch' },
]

export const LINKS_PER_LANE = 3
export const DEST_IDS: string[] = LANES.flatMap((lane) =>
  Array.from({ length: LINKS_PER_LANE }, (_, i) => `${lane.key}-${i + 1}`),
)

export const destHref = (id: string) => `${DEMO_BASE}/dest/${id}`
export const laneOf = (id: string) => id.split('-')[0] as LaneKey

/** Resource Timing에서 읽어낸 목적지 RSC 요청 1건 */
export interface RscEntry {
  id: string
  startTime: number
  responseEnd: number
  transferSize: number
}

/** 링크 클릭 → 목적지 화면 표시까지 한 번의 이동 측정값 */
export interface NavMeasurement {
  id: string
  clickAt: number
  /** loading.tsx(스켈레톤)가 마운트된 시각 — 없으면 null */
  loadingAt: number | null
  /** page.tsx 본문이 마운트된 시각 */
  contentAt: number
}

/** stats/route.ts가 돌려주는 목적지별 서버 렌더 횟수 */
export type ServerCounts = Record<string, { layout: number; page: number }>
