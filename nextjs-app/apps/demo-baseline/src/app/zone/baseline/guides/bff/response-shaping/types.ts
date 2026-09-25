// 서버(_lib, route.ts, shaping.ts)와 클라이언트(hooks, components)가 함께 쓰는 타입만 둔다.

/** 레거시 상품 API의 원본 데이터 (대문자 약어 컬럼명 + 깊은 중첩 그대로) */
export interface LegacyProductData {
  PRD_NO: string
  PRD_INFO: {
    PRD_NM: string
    BRAND_NM: string
    CTGRY_PATH: string[]
    DESC_HTML: string
    SEO: { TITLE: string; KEYWORDS: string[]; CANONICAL: string }
  }
  PRICE_INFO: {
    LIST_PRC: number
    SALE_PRC: number
    COST_PRC: number
    MARGIN_RT: number
    PRICE_POLICY_ID: string
    CURRENCY_CD: string
  }
  STOCK_INFO: { WH_CD: string; WH_INTERNAL_SKU: string; TOT_QTY: number; RSV_QTY: number; SAFETY_QTY: number }
  SUPPLIER: { SUPPLIER_CD: string; SUPPLIER_NM: string; CONTRACT_NO: string; SETTLE_ACCT: string }
  IMG_LIST: { TYPE: 'THUMB_S' | 'THUMB_M' | 'DETAIL' | 'ZOOM' | 'ORIGIN'; W: number; H: number; URL: string }[]
  OPT_LIST: { OPT_CD: string; OPT_NM: string; ADD_PRC: number; STOCK_QTY: number; WH_INTERNAL_SKU: string }[]
  REVIEW_SUMMARY: { AVG_SCORE: number; CNT: number; SCORE_DIST: number[] }
  SHIP_POLICY: { FREE_SHIP_YN: 'Y' | 'N'; SHIP_FEE: number; RETURN_ADDR: string }
  AUDIT_LOG: { ACT_DTM: string; ADMIN_ID: string; ACT_CD: string; BEFORE_VAL: string; AFTER_VAL: string }[]
  INTERNAL_MEMO: string
  REG_DTM: string
  UPD_DTM: string
  USE_YN: 'Y' | 'N'
  DEL_YN: 'Y' | 'N'
}

/**
 * 레거시 API의 응답 봉투. 실패해도 HTTP 200에 RESULT_CD로 오류를 알리고,
 * 서버 노드명·스택 같은 내부 정보를 그대로 싣는 전형적인 레거시 형태다.
 */
export interface LegacyEnvelope {
  RESULT_CD: string
  RESULT_MSG: string
  SVR_NODE: string
  TRACE_ID: string
  DATA?: LegacyProductData
  ERR_STACK?: string
}

/** BFF가 모바일 상품 카드 한 장에 필요한 만큼만 평탄화해 보내는 응답 */
export interface MobileProductCard {
  id: string
  name: string
  brand: string
  price: number
  listPrice: number
  discountRate: number
  thumbnailUrl: string
  rating: number
  reviewCount: number
  stockStatus: '구매 가능' | '품절 임박' | '품절'
  freeShipping: boolean
  optionCount: number
}

/** BFF 오류 응답: 메시지 한 줄만 싣는다 */
export interface BffError {
  error: string
}

export type EndpointKind = 'legacy' | 'bff'

/** 브라우저가 응답 1건을 받아 실제로 재고 파싱한 결과 */
export interface MeasuredResponse {
  url: string
  status: number
  /** Resource Timing: 압축 해제 후 본문 바이트 (JSON.parse 대상 크기) */
  decodedBodySize: number
  /** Resource Timing: 선로 위 본문 바이트 (gzip 등 적용 시 decoded보다 작음) */
  encodedBodySize: number
  /** Resource Timing: 헤더 포함 전송량 (브라우저가 0을 줄 수도 있음) */
  transferSize: number
  topLevelKeys: string[]
  /** 원시값(문자열·숫자·불리언·null) 리프 개수 — 배열 원소 포함 */
  leafCount: number
  /** 객체·배열 중첩 깊이 (평탄한 객체 = 1) */
  maxDepth: number
  /** 응답 JSON 안에서 발견된 민감 키의 경로 */
  sensitivePaths: string[]
  /** 서버가 Server-Timing으로 알린 레거시 호출 여부 (BFF만) */
  legacyCalled: boolean | null
  body: unknown
}

export interface ComparisonResult {
  id: string
  runId: string
  legacy: MeasuredResponse
  bff: MeasuredResponse
}

export type ComparisonResults = Record<string, ComparisonResult>
