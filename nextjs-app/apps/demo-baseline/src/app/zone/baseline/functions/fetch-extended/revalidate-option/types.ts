export type ProductCode = 'PROD-001' | 'PROD-002'

/** 내부 mutable 데이터원(Route Handler)이 매 origin 호출마다 새로 만들어 내는 값 */
export interface StockSourcePayload {
  productCode: ProductCode
  stock: number
  priceKrw: number
  /** 이 productCode에 대해 origin(Route Handler)이 실제로 실행된 누적 횟수 */
  originCallCount: number
  generatedAt: string
}

/** Server Action이 fetch(next.revalidate) 결과를 감싸 클라이언트로 돌려주는 값 */
export interface StockFetchResult extends StockSourcePayload {
  revalidateSeconds: number
  httpStatus: number
  fetchedAt: string
  durationMs: number
}

export type CacheStatus = 'INIT' | 'HIT' | 'MISS'

export interface PollLogEntry extends StockFetchResult {
  clientSeq: number
  cacheStatus: CacheStatus
}
