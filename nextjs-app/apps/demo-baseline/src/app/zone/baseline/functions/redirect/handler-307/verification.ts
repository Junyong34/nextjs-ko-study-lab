import type { OrderInput, RedirectObservation, SubmittedOrder } from './types'

export function parseOrderInput(value: unknown, productIds: readonly string[]): OrderInput | null {
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>
  if (typeof input.productId !== 'string' || !productIds.includes(input.productId)
    || typeof input.quantity !== 'number' || !Number.isInteger(input.quantity)
    || input.quantity < 1 || input.quantity > 10
    || typeof input.requestId !== 'string' || !input.requestId.trim()
    || input.requestId.length > 100) return null
  return { productId: input.productId, quantity: input.quantity, requestId: input.requestId }
}

export function verifyRedirect(
  submitted: SubmittedOrder,
  observed: RedirectObservation,
  expectedUrl: string,
) {
  const mismatch = (reason: string) => ({ isMatched: false, reason })
  if (observed.status < 200 || observed.status >= 300) {
    return mismatch(`최종 응답이 HTTP ${observed.status}입니다. 요청이 거부되어 접수 결과를 검증할 수 없습니다.`)
  }
  if (!observed.redirected) return mismatch('리다이렉트를 거친 응답이 아닙니다.')
  try {
    const final = new URL(observed.url)
    const expected = new URL(expectedUrl)
    if (final.origin !== expected.origin || final.pathname !== expected.pathname) {
      return mismatch('최종 응답이 이 실습의 새 접수 주소에서 오지 않았습니다.')
    }
  } catch {
    return mismatch('최종 응답 주소를 확인할 수 없습니다.')
  }
  const receipt = observed.receipt
  if (!receipt) return mismatch('서버에서 유효한 접수 결과를 받지 못했습니다.')
  if (receipt.productId !== submitted.productId || receipt.quantity !== submitted.quantity
    || receipt.requestId !== submitted.requestId) {
    return mismatch('수신한 상품·수량 또는 요청 식별자가 이번 제출과 다릅니다.')
  }
  if (submitted.method === 'GET' && receipt.method === 'GET' && receipt.source === 'query') {
    return mismatch('GET이 그대로 유지됐습니다. 307은 GET을 POST로 바꾸지 않으므로 POST·본문 보존 목표에는 불일치입니다.')
  }
  if (submitted.method !== 'POST' || receipt.method !== 'POST' || receipt.source !== 'body') {
    return mismatch('새 접수 주소에서 POST 메서드와 JSON 본문을 함께 확인하지 못했습니다.')
  }
  return {
    isMatched: true,
    reason: '새 접수 주소가 이번 POST의 상품·수량·요청 식별자를 본문에서 그대로 읽었습니다. 중간 307은 Network에서 확인하세요.',
  }
}
