'use server'

import type { FieldErrors, FormState } from './types'

export async function validateOrderFormAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawEmail = formData.get('email')
  const rawQuantity = formData.get('quantity')
  const fields = {
    email: typeof rawEmail === 'string' ? rawEmail : '',
    quantity: typeof rawQuantity === 'string' ? rawQuantity : '',
  }
  const email = fields.email.trim()
  const quantity = Number(fields.quantity)
  const errors: FieldErrors = {}

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = '이메일 형식을 확인하세요. 예: customer@example.com'
  }
  if (!fields.quantity.trim() || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    errors.quantity = '수량은 1~10 사이의 정수로 입력하세요.'
  }
  if (Object.keys(errors).length > 0) {
    return { status: 'error', fields, errors, data: null }
  }
  return { status: 'success', fields, errors: {}, data: { email, quantity } }
}
