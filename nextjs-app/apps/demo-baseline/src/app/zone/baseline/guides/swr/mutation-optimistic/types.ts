export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
  /** 서버가 허용하는 최대 수량 — 넘는 요청은 서버가 이 값으로 잘라 확정한다 */
  stock: number
}

/** api/cart Route Handler가 돌려주는 장바구니 스냅샷 */
export interface Cart {
  items: CartItem[]
  /** 서버 저장소의 변경 버전 — PATCH 성공마다 1 증가 */
  version: number
  /** 이 스냅샷을 만든 서버 요청 번호 */
  requestNo: number
  servedAt: number
  /** optimisticData로 만든 화면 전용 값에만 붙는다. 서버 응답에는 없다 */
  optimisticRunId?: number
}

export interface PatchInput {
  itemId: string
  delta: number
  delayMs: number
  fail: boolean
}

/** 서버가 받은 요청 순서 기록 (api/log) */
export interface ServerLogEntry {
  no: number
  method: 'GET' | 'PATCH' | 'DELETE'
  at: number
  detail: string
}

export interface ServerLog {
  entries: ServerLogEntry[]
  cart: Cart
}

export type LabEventKind =
  | 'fetch-start'
  | 'fetch-end'
  | 'patch-start'
  | 'patch-ok'
  | 'patch-fail'
  | 'display'
  | 'mount'

/** 브라우저에서 기록한 사건 하나. t는 실습 시작 기준 경과 ms(performance.now) */
export interface LabEvent {
  seq: number
  t: number
  kind: LabEventKind
  detail: string
  /** display 이벤트: 화면에 그려진 상품별 수량과 낙관적 값 여부 */
  qtys?: Record<string, number>
  optimistic?: boolean
  /** patch-ok: 응답에 담긴 대상 상품의 서버 확정 수량 */
  serverQty?: number
}

export interface LabSettings {
  delayMs: number
  failNext: boolean
  revalidate: boolean
}

/** mutate() 한 번의 기록 */
export interface MutationRun {
  id: number
  itemId: string
  itemName: string
  delta: number
  beforeQty: number
  optimisticQty: number
  settings: LabSettings
  startT: number
  /** mutate()가 끝난 뒤 api/log로 다시 읽은 서버 저장소 수량 */
  serverQtyAfter: number | null
  settled: boolean
}

/** 같은 키를 읽는 구독 컴포넌트를 추가로 마운트한 기록 */
export interface MountRun {
  startT: number
  /** 마운트 시점에 마지막 GET 시작으로부터 지난 시간 */
  msSinceLastFetch: number | null
  settled: boolean
}

export type LatestAction = { type: 'mutate'; run: MutationRun } | { type: 'mount'; run: MountRun }
