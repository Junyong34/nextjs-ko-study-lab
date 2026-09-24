// 서버(_lib, route.ts)와 클라이언트(hooks, components)가 함께 쓰는 타입만 둔다.

export type LegacyServiceName = 'orders' | 'inventory' | 'shipping'
export type BffMode = 'parallel' | 'serial'
export type ScenarioKind = 'direct' | 'bff-serial' | 'bff-parallel'

/** 레거시 주문 시스템 원본 응답 (대문자 약어 컬럼명 그대로) */
export interface LegacyOrder {
  ORDER_NO: string
  ORDER_STAT_CD: '10' | '20' | '30'
  CUST_NO: string
  REG_DTM: string
  ITEM_LIST: { SKU_CD: string; QTY: number; UNIT_PRC: number }[]
}

/** 레거시 물류(WMS) 재고 원본 응답 */
export interface LegacyInventory {
  WH_CD: string
  STOCK_LIST: { SKU_CD: string; AVAIL_QTY: number; RSV_QTY: number }[]
  UPD_DTM: string
}

/** 레거시 배송 추적 원본 응답 */
export interface LegacyShipping {
  DLV_NO: string
  CARRIER_CD: string
  TRACK_NO: string
  DLV_STAT_CD: 'READY' | 'PICKED' | 'IN_TRANSIT'
}

/** BFF가 레거시 호출 1건마다 서버에서 잰 구간 (BFF 핸들러 시작 시점 기준 ms) */
export interface LegacyCallSpan {
  service: LegacyServiceName
  startMs: number
  endMs: number
}

/** 화면 한 장을 그리는 데 필요한 형태로 합친 BFF 응답 */
export interface BffOrderResponse {
  order: {
    orderId: string
    statusLabel: string
    items: { sku: string; qty: number; available: number }[]
  }
  shipping: { carrier: string; trackingNo: string; statusLabel: string }
  meta: {
    mode: BffMode
    serverMs: number
    spans: LegacyCallSpan[]
  }
}

/** 브라우저에서 시나리오 1회를 실행해 얻은 실측값 */
export interface ScenarioResult {
  kind: ScenarioKind
  runId: string
  /** Resource Timing에 기록된 이번 실행의 요청 수 */
  requestCount: number
  /** 브라우저가 요청한 경로 목록 (Resource Timing entry.name 기준) */
  requestedPaths: string[]
  /** 버튼 클릭 → 모든 응답 본문 수신까지 브라우저 기준 총 소요 ms */
  clientMs: number
  /** 응답 본문 크기 합계 (decodedBodySize) */
  bodyBytes: number
  /** BFF일 때만: 응답 중 측정용 meta를 뺀 화면 데이터(order+shipping)의 JSON 바이트 수 */
  dataBytes: number | null
  /** 헤더 포함 전송량 합계 (transferSize, 브라우저가 0을 줄 수도 있음) */
  transferBytes: number
  /** BFF일 때만: 서버에서 잰 레거시 취합 소요 ms와 호출 구간 */
  server: BffOrderResponse['meta'] | null
}

export type ScenarioResults = Partial<Record<ScenarioKind, ScenarioResult>>
