import type { OrderResult } from './types'

export function validateOrder(data: FormData, productId: string): OrderResult {
  const read = (key: string) => typeof data.get(key) === 'string' ? String(data.get(key)) : ''
  const input = { requestId: read('requestId'), productId: read('productId'), quantity: read('quantity') }
  const errors: OrderResult['errors'] = {}
  const quantity = Number(input.quantity)
  if (!input.quantity.trim() || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    errors.quantity = '수량은 1~10 사이의 정수여야 합니다.'
  }
  if (input.productId !== productId) errors.productId = '예시 상품을 확인해 주세요.'
  if (!input.requestId || input.requestId.length > 100) errors.requestId = '제출 식별자를 확인해 주세요.'
  return { status: Object.keys(errors).length ? 'error' : 'success', input, errors }
}
