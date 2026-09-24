export type SortKey = 'price_asc' | 'price_desc' | 'rating'

/** URL searchParams에서 해석한 필터 조건. 서버와 클라이언트가 같은 파서를 쓴다. */
export interface Filters {
  categories: string[]
  sort: SortKey | null
  inStock: boolean
}

export interface CategoryOption {
  value: string
  label: string
}

/** Server Component page가 이번 요청에서 실제로 계산한 값. */
export interface ServerSnapshot {
  /** 서버 렌더마다 새로 만드는 식별자. 같은 값이 다시 보이면 서버를 다시 거치지 않고 복원된 것이다. */
  renderId: string
  /** 서버에서 page가 렌더링된 시각 (ISO) */
  renderedAt: string
  /** 서버가 page props의 searchParams로 받은 값을 정규화한 문자열 */
  receivedSearch: string
  filters: Filters
  /** 필터 전 전체 상품 수 */
  total: number
  /** 서버가 필터링한 결과 상품 수 */
  count: number
  /** 대기 피드백을 관찰하기 위해 서버 읽기에 주입한 지연(ms) */
  latencyMs: number
}

export type NavKind = 'load:navigate' | 'load:reload' | 'load:back_forward' | 'load:prerender' | 'push' | 'popstate'

/** 서버 렌더 결과(renderId)가 화면에 도착할 때마다 클라이언트가 남기는 관측 기록. */
export interface NavEntry {
  seq: number
  kind: NavKind
  /** 도착 시점 브라우저 location.search (정규화) */
  urlSearch: string
  /** 이 렌더에서 서버가 받은 searchParams (정규화) */
  serverSearch: string
  renderId: string
  renderedAt: string
  count: number
  /** 이미 본 renderId가 다시 도착했는가 (서버 재요청 없이 캐시에서 복원) */
  reusedRender: boolean
  /** 이동을 시작할 때의 장바구니 수량 (초기 로드는 null) */
  cartBefore: number | null
  /** 서버 렌더가 도착한 뒤의 장바구니 수량 */
  cartAfter: number
  /** 장바구니를 가진 Client Component의 인스턴스 식별자 */
  mountId: string
  /** 클릭/popstate부터 새 렌더 도착까지 걸린 시간(ms) */
  ms: number | null
}

export interface UnloadRecord {
  search: string
  cartCount: number
  mountId: string
  at: string
  /** 새로고침 직전 문서에서 관측한 이동 관련 판정(1~4). 관측 기록일 뿐 장바구니 복원에는 쓰지 않는다. */
  priorChecks?: CheckResult[]
}

/** 새로고침 직전(pagehide)과 직후(mount)의 실측값 쌍 */
export interface ReloadObservation {
  before: UnloadRecord
  after: { search: string; cartCount: number; mountId: string }
}

export interface CheckResult {
  label: string
  observed: boolean
  ok: boolean
  detail: string
}
