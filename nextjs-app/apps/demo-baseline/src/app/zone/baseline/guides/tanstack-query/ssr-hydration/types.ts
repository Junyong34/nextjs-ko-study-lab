export type DealsVariant = 'prefetched' | 'client-only'

/** 데이터를 실제로 읽은 쪽 — 서버 컴포넌트 prefetch인지, 브라우저가 부른 Route Handler인지 */
export type ReadSource = 'server-prefetch' | 'route-handler'

export interface Deal {
  id: string
  name: string
  price: number
  discount: number
}

export interface DealsSnapshot {
  items: Deal[]
  source: ReadSource
  /** 서버 데이터 읽기 번호 (초기화 이후) */
  readNo: number
  /** 서버가 데이터를 읽은 시각 (서버 시계 ms) */
  fetchedAt: number
}

export interface ServerRead {
  no: number
  source: ReadSource
  variant: DealsVariant
  at: number
}

/** 서버 컴포넌트가 렌더 시점에 넘겨주는 정보 */
export interface ServerRenderInfo {
  variant: DealsVariant
  /** 이번 서버 렌더 고유 id — 새로고침마다 바뀐다 */
  renderId: string
  renderedAt: number
  /** new QueryClient() 직후 캐시에 든 쿼리 수 — 요청마다 새로 만들었다면 항상 0 */
  cacheSizeAtCreate: number | null
  /** prefetch가 캐시에 넣은 데이터의 서버 읽기 번호 (client-only는 null) */
  prefetchedReadNo: number | null
}

export type ProbeStaleTime = 0 | 60_000

export interface StaleProbeRun {
  id: number
  staleTime: ProbeStaleTime
  /** 마운트 시점 데이터 나이(ms) — staleTime보다 크면 재요청이 기대된다 */
  ageAtMount: number
  /** 마운트 시점 performance.now() */
  startT: number
}

/** 하이드레이션 직후 브라우저에서 잰 값 */
export interface HydrationMeasure {
  /** 첫 effect 시점 DOM에 이미 있던 상품 행 수 (= 서버 HTML이 그린 행) */
  rowsAtFirstEffect: number
  /** 첫 effect 시점 queryClient의 쿼리 상태 */
  statusAtFirstEffect: string
  dataSourceAtFirstEffect: ReadSource | null
  dataUpdatedAt: number
  /** 첫 effect 시점의 서버 시계 기준 추정 시각과 비교하기 위한 Date.now() */
  clientNow: number
}

export interface HtmlCheck {
  status: number
  rowsInHtml: number
  /** 응답 HTML에 queryKey 문자열(dehydrated state)이 들어 있는지 */
  hasDehydratedKey: boolean
  bytes: number
}
