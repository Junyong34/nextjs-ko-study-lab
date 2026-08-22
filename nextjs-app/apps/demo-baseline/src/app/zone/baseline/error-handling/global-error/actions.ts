'use server'

import type { FormState } from './types'

/**
 * 예상된 에러(Expected Errors):
 * try/catch로 예외를 throw하지 않고,
 * 상태 객체({ success: false, message: '...' })로 모델링하여 useActionState로 전달합니다.
 */
export async function submitOrderAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get('email')?.toString() || ''
  const amountStr = formData.get('amount')?.toString() || ''
  const amount = Number(amountStr)

  if (!email.includes('@')) {
    return {
      success: false,
      message: '유효하지 않은 이메일 형식입니다.',
      fieldErrors: { email: '올바른 이메일 주소를 입력해 주세요 (예: user@example.com)' },
    }
  }

  if (isNaN(amount) || amount <= 0) {
    return {
      success: false,
      message: '결제 금액은 0원보다 커야 합니다.',
      fieldErrors: { amount: '1원 이상의 금액을 입력하세요.' },
    }
  }

  return {
    success: true,
    message: `주문이 성공적으로 접수되었습니다! (${email}, ${amount.toLocaleString()}원)`,
  }
}
