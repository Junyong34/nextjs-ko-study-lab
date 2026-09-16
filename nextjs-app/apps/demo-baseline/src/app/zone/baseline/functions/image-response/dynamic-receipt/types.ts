export const RECEIPT_PRODUCT_IDS = ['prod-001', 'prod-003', 'prod-006'] as const
export type ReceiptProductId = (typeof RECEIPT_PRODUCT_IDS)[number]

export const RECEIPT_COUPON_IDS = ['none', 'cp-welcome', 'cp-vip'] as const
export type ReceiptCouponId = (typeof RECEIPT_COUPON_IDS)[number]

export type ReceiptPaymentMethod = 'CARD' | 'KAKAO_PAY'

export const RECEIPT_MAX_QUANTITY = 5

export interface ReceiptFetchSuccess {
  kind: 'success'
  orderId: string
  productId: string
  quantity: number
  byteLength: number
  sha256: string
  contentType: string | null
  cacheControl: string | null
  objectUrl: string
}

export interface ReceiptFetchFailure {
  kind: 'failure'
  status: number
  message: string
}

export type ReceiptFetchResult = ReceiptFetchSuccess | ReceiptFetchFailure

export function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}
