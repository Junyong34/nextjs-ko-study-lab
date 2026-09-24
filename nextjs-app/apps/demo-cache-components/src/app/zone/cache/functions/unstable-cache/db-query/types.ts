export type Category = 'keyboard' | 'mouse' | 'monitor'
export type Currency = 'KRW' | 'USD'

/** 가짜 DB 테이블 products의 한 행 */
export interface ProductRow {
  id: string
  name: string
  category: Category
  price: number
}

/** 캐시 함수 본문(=실제 쿼리 실행) 안에서만 만들어지는 실행 기록 */
export interface QueryStamp {
  /** 이 서버 프로세스에서 몇 번째로 실행된 쿼리인지 */
  runId: number
  /** 쿼리를 실행한 서버 프로세스 식별자 (프로세스 재시작 시 바뀜) */
  bootId: string
  /** 쿼리 실행 시각. MISS에서는 Date 그대로, HIT에서는 JSON 복원값(string)이 돌아온다 */
  executedAt: Date | string
}

export interface CategoryQueryResult extends QueryStamp {
  category: Category
  rows: ProductRow[]
}

export interface PriceSummaryResult extends QueryStamp {
  currency: Currency
  total: string
}

/**
 * MISS: 이번 호출 안에서 쿼리가 실행되고 그 결과가 반환됨
 * HIT: 쿼리 미실행, 저장된 결과 반환
 * STALE: 저장된(만료된) 결과를 반환하면서 쿼리는 백그라운드로 재실행됨
 */
export type CallStatus = 'MISS' | 'HIT' | 'STALE'

export interface CallRecord {
  kind: 'category' | 'summary'
  /** 학습자가 비교할 호출 단위 (같은 key = 같은 인자/설정의 호출) */
  key: string
  label: string
  status: CallStatus
  runId: number
  fromOtherProcess: boolean
  executedAtIso: string
  executedAtType: string
  /** 반환된 결과가 만들어진 뒤 흐른 시간(초) */
  ageSec: number
  countBefore: number
  countAfter: number
  calledAtIso: string
  summary: string
  requestedCurrency?: Currency
  returnedCurrency?: Currency
  includeCurrencyInKey?: boolean
  category?: Category
  /** 반환된 행의 상품별 가격 (카테고리 조회에서만) */
  prices?: Record<string, number>
}

export interface DbSnapshot {
  rows: ProductRow[]
  executions: number
  bootId: string
}

export type TimelineEvent =
  | { type: 'call'; seq: number; record: CallRecord }
  | { type: 'invalidate'; seq: number; tag: string; scope: Category | 'all'; atIso: string }
  | { type: 'write'; seq: number; productId: string; newPrice: number; atIso: string }

export interface ActionResult<T> {
  data: T
  snapshot: DbSnapshot
}
