'use server'
import { MOCK_COUPONS, type Coupon } from '@study/demo-kit'

export type CouponActionResult = {
  success: boolean
  coupon?: Coupon
  discount?: number
  finalAmount?: number
  error?: string
  /** 서버에서만 생성 가능한 처리 시각. 클라이언트가 값을 조작할 수 없어 실제 요청·응답 왕복의 증거로 쓴다. */
  processedAt: string
}

export async function applyCouponAction(code: string, orderAmount: number): Promise<CouponActionResult> {
  await new Promise(r => setTimeout(r, 400))
  const processedAt = new Date().toLocaleTimeString('ko-KR')
  const found = MOCK_COUPONS.find(c => c.code === code.toUpperCase().trim())
  if (!found) {
    return { success: false, error: '유효하지 않은 쿠폰 코드입니다.', processedAt }
  }
  if (orderAmount < found.minOrderAmount) {
    return { success: false, error: `최소 주문금액(${found.minOrderAmount.toLocaleString()}원) 미달`, processedAt }
  }
  const discount = found.discountType === 'PERCENT'
    ? (orderAmount * found.discountValue) / 100
    : found.discountValue
  return {
    success: true,
    coupon: found,
    discount,
    finalAmount: orderAmount - discount,
    processedAt,
  }
}
