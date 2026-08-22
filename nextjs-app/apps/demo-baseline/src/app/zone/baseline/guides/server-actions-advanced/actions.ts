'use server'

import type { CouponState } from './types'

const VALID_COUPONS: Record<string, number> = {
  WELCOME2026: 10000,
  NEXTJS16: 15000,
  VIPSTUDY: 30000,
}

export async function applyCouponAction(
  prevState: CouponState,
  formData: FormData,
): Promise<CouponState> {
  const code = formData.get('couponCode')?.toString().trim().toUpperCase() || ''

  // 400ms 서버 유효성 검증
  await new Promise((resolve) => setTimeout(resolve, 400))

  if (!code) {
    return {
      success: false,
      message: '쿠폰 코드를 입력해 주세요.',
    }
  }

  if (VALID_COUPONS[code]) {
    const discount = VALID_COUPONS[code]
    return {
      success: true,
      message: `축하합니다! "${code}" 쿠폰이 적용되어 ${discount.toLocaleString()}원이 할인됩니다.`,
      discountAmount: discount,
      appliedCode: code,
    }
  }

  return {
    success: false,
    message: `유효하지 않거나 기간이 만료된 쿠폰 코드입니다. (테스트 가능 코드: WELCOME2026, NEXTJS16, VIPSTUDY)`,
  }
}
