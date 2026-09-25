/** 이 배치를 어느 경로로 실행했는지 — Server Action vs Route Handler. */
export type SettlementSource = 'server-action' | 'route-handler'

/**
 * 정산 배치 한 회차 실행 결과. 서버(actions.ts / settle-batch/route.ts)가
 * 자기 모듈에 선언된 실제 `maxDuration` 값과, `Date.now()`로 직접 측정한
 * 실제 처리 시간(elapsedMs)을 그대로 실어 보낸다 — 클라이언트는 이 값을
 * 다시 계산하지 않고 서버가 보낸 값을 그대로 표시한다.
 */
export interface SettlementBatchResult {
  source: SettlementSource
  orderCount: number
  /** 주문 1건 정산에 실제로 소요시킨 지연(ms). 외부 PG 정산 API 왕복을 흉내 낸다. */
  perOrderMs: number
  /** 이 요청을 처리한 세그먼트가 소스에 선언한 maxDuration(초) — 같은 모듈의 상수를 그대로 반환값에 실었다. */
  declaredMaxDurationSeconds: number
  startedAt: string
  finishedAt: string
  /** 서버에서 Date.now() 차이로 직접 측정한 실제 처리 시간(ms). */
  elapsedMs: number
  /** elapsedMs가 declaredMaxDurationSeconds * 1000을 넘었는지 — 로컬은 이걸로 강제 종료하지 않는다. */
  exceededDeclaredLimit: boolean
}

export interface SettlementRunOutcome {
  source: SettlementSource
  result?: SettlementBatchResult
  /** 클라이언트에서 요청 시작~응답 수신까지 실측한 왕복 시간(ms). 서버 처리 시간 + 네트워크 왕복을 포함한다. */
  clientRoundTripMs?: number
  httpStatus?: number
  error?: string
}

export interface SettlementLogEntry {
  id: number
  text: string
  tone: 'info' | 'success' | 'warn'
}

export const MIN_ORDER_COUNT = 1
export const MAX_ORDER_COUNT = 20
