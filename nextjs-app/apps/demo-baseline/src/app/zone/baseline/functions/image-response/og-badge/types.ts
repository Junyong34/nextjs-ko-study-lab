export interface OgBadgeProduct {
  id: string
  name: string
  price: number
}

export const OG_BADGE_PRODUCTS: OgBadgeProduct[] = [
  { id: 'PROD-001', name: '프리미엄 러닝화', price: 129000 },
  { id: 'PROD-002', name: '방수 윈드브레이커', price: 189000 },
]

/** route.ts가 화이트리스트로 검증하는 할인율. 화면 버튼 목록으로도 재사용된다 */
export const OG_BADGE_DISCOUNT_RATES = [10, 30, 50, 70] as const

export type OgBadgeDiscountRate = (typeof OG_BADGE_DISCOUNT_RATES)[number]

export const OG_BADGE_API_ENDPOINT = '/zone/baseline/functions/image-response/og-badge/api'

/** route.ts 응답 헤더에서 읽어 3단 검증 패널까지 끌어올리는 실측 상태 */
export interface OgBadgeResponseState {
  requestedProductId: string | null
  requestedDiscountRate: number | null
  httpStatus: number | null
  contentType: string | null
  /** 응답 PNG 바이너리의 실제 바이트 크기 (Content-Length) */
  contentLength: number | null
  cacheControl: string | null
  /** route.ts 모듈 스코프 카운터 — 서버가 실제로 GET을 몇 번 실행했는지 (x-study-og-request-seq) */
  requestSeq: number | null
  /** route.ts가 요청을 처리한 서버 시각 (x-study-og-rendered-at) */
  renderedAt: string | null
  /** 바로 직전 응답의 Content-Length. 파라미터를 바꿨을 때 실제로 PNG 바이트가 달라지는지 대조하는 데 쓰인다 */
  previousContentLength: number | null
}

export const INITIAL_OG_BADGE_RESPONSE_STATE: OgBadgeResponseState = {
  requestedProductId: null,
  requestedDiscountRate: null,
  httpStatus: null,
  contentType: null,
  contentLength: null,
  cacheControl: null,
  requestSeq: null,
  renderedAt: null,
  previousContentLength: null,
}
