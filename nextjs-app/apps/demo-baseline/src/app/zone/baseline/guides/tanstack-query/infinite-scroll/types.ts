export interface Product {
  id: string
  name: string
  category: string
  price: number
}

/** api/products Route Handler의 한 페이지 응답 */
export interface ProductPage {
  items: Product[]
  /** 다음 페이지를 요청할 커서(이 페이지 마지막 상품 id). 마지막 페이지면 null */
  nextCursor: string | null
  pageNo: number
  total: number
  /** 초기화 이후 서버가 받은 상품 요청 번호 */
  requestNo: number
  /** 초기화 이후 서버가 이 커서를 받은 횟수 — 같은 페이지 중복 요청이 서버까지 갔는지 */
  cursorHits: number
}

export type FetchStatus = 'pending' | 'ok' | 'aborted' | 'error'

/** queryFn이 한 번 실행될 때마다 남는 기록 */
export interface FetchRecord {
  id: number
  cursor: string | null
  /** performance.now() 기준 ms */
  startedAt: number
  endedAt: number | null
  status: FetchStatus
  pageNo: number | null
  cursorHits: number | null
}

export type LabActionType = 'first-entry' | 'reentry' | 'scroll' | 'burst-default' | 'burst-guarded'

export interface LabAction {
  id: number
  type: LabActionType
  startT: number
  /** 동작 시작 시점에 캐시에 있던 페이지 수 */
  pagesAtStart: number
  /** 진입 동작: 첫 렌더에 캐시 데이터가 이미 있었는지 */
  hadDataOnFirstRender?: boolean
  /** 진입 동작: 진입 시점에 캐시가 staleTime을 넘겼는지 */
  staleAtEntry?: boolean
}

export interface ObserveState {
  fetches: FetchRecord[]
  actions: LabAction[]
  /** 판정 대기 시간이 지난 동작 id */
  settledIds: number[]
  /** PerformanceObserver가 받은 상품 API Resource Timing 항목의 startTime */
  resourceStarts: number[]
}
