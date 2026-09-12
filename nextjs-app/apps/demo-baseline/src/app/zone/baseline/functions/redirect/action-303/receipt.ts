import type { OrderInput, ReceiptResult } from './types'

export const RECEIPT_MAX_AGE = 10 * 60

export function validateOrder(
  productId: unknown,
  quantity: unknown,
  allowedProducts: string[],
): OrderInput | null {
  if (typeof productId !== 'string' || !allowedProducts.includes(productId)) return null
  if (typeof quantity !== 'string' || !/^(?:[1-9]|10)$/.test(quantity)) return null
  return { productId, quantity: Number(quantity) }
}

export function readReceipt(
  raw: string | undefined,
  id: unknown,
  allowedProducts: string[],
  now = Date.now(),
): ReceiptResult {
  const fail = (error: string): ReceiptResult => ({ receipt: null, error })
  if (!raw) return fail('저장된 확인서가 없습니다. 시작 화면에서 상품을 제출해 주세요.')
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return fail('확인서 쿠키를 읽을 수 없습니다. 초기화 후 다시 제출해 주세요.')
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fail('확인서 형식이 올바르지 않습니다.')
  }
  const record = value as Record<string, unknown>
  const { receiptId, productId, quantity, issuedAt } = record
  if (typeof receiptId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(receiptId)) {
    return fail('확인서 식별자 형식이 올바르지 않습니다.')
  }
  if (typeof id !== 'string' || receiptId !== id) {
    return fail('완료 URL의 식별자와 저장된 확인서가 다릅니다.')
  }
  if (typeof quantity !== 'number' || !validateOrder(productId, String(quantity), allowedProducts)) {
    return fail('확인서의 상품 또는 수량이 허용 범위를 벗어났습니다.')
  }
  if (typeof issuedAt !== 'number' || !Number.isFinite(issuedAt) || issuedAt > now || now - issuedAt >= RECEIPT_MAX_AGE * 1000) {
    return fail('확인서가 만료되었거나 발급 시각이 올바르지 않습니다. 다시 제출해 주세요.')
  }
  return { receipt: { receiptId, productId: productId as string, quantity, issuedAt }, error: null }
}
