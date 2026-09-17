export interface Order {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
  status: string
  createdAt: string
}

/** 이번에 실제로 호출한 route.ts 핸들러 종류 */
export type OrderActionKind = 'get' | 'post-valid' | 'post-invalid'

/**
 * route.ts 실제 응답을 읽어 채우는 상태입니다.
 * createdOrderId/createdOrderVisible은 "POST로 만든 주문이 GET 목록에 실제로 나타나는지"를
 * 검증하기 위한 값으로, 화면에서 꾸며내지 않고 매 요청의 실제 응답에서만 채워집니다.
 */
export interface DemoStatus {
  lastAction: OrderActionKind | null
  httpStatus: number | null
  expectedStatus: number | null
  orderCount: number
  createdOrderId: string | null
  createdOrderVisible: boolean
}

export const INITIAL_DEMO_STATUS: DemoStatus = {
  lastAction: null,
  httpStatus: null,
  expectedStatus: null,
  orderCount: 0,
  createdOrderId: null,
  createdOrderVisible: false,
}
