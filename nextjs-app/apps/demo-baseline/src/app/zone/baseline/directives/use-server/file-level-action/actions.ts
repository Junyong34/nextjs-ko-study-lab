'use server'
import { MOCK_COUPONS, type Coupon } from '@study/demo-kit'

export type CouponActionResult = {
  success: boolean
  coupon?: Coupon
  discount?: number
  finalAmount?: number
  error?: string
}

export async function applyCouponAction(code: string, orderAmount: number): Promise<CouponActionResult> {
  await new Promise(r => setTimeout(r, 400))
  const found = MOCK_COUPONS.find(c => c.code === code.toUpperCase().trim())
  if (!found) {
    return { success: false, error: '유효하지 않은 쿠폰 코드입니다.' }
  }
  if (orderAmount < found.minOrderAmount) {
    return { success: false, error: `최소 주문금액(${found.minOrderAmount.toLocaleString()}원) 미달` }
  }
  const discount = found.discountType === 'PERCENT'
    ? (orderAmount * found.discountValue) / 100
    : found.discountValue
  return {
    success: true,
    coupon: found,
    discount,
    finalAmount: orderAmount - discount,
  }
}
