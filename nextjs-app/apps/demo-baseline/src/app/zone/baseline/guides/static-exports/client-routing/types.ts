export interface Product {
  id: string
  name: string
  price: string
}

/** 패치한 window.fetch가 기록한 클라이언트 라우터의 RSC 요청 한 건 */
export interface RscRequest {
  seq: number
  /** origin을 뺀 요청 URL(쿼리 포함) */
  url: string
  pathname: string
  /** _rsc 캐시 버스팅 쿼리 값 */
  rscQuery: string | null
  /** 요청 헤더 rsc 값 (라우터가 붙이는 RSC 요청 표시) */
  rscHeader: string | null
  /** next-router-prefetch 헤더가 있으면 prefetch 요청 */
  kind: 'navigation' | 'prefetch'
  status: number | null
  contentType: string | null
  error?: string
}

export interface DynamicProbe {
  path: string
  status: number
}

export type CheckState = 'wait' | 'pass' | 'fail'

export interface Check {
  id: string
  label: string
  expected: string
  actual: string
  state: CheckState
}
