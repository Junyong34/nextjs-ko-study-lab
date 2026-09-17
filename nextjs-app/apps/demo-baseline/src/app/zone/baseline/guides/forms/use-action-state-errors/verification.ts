import type { ExpectedScenario, FormState } from './types'

export const scenarioLabels: Record<ExpectedScenario, string> = {
  'both-errors': '이메일·수량 오류',
  'email-error': '이메일만 오류',
  'quantity-error': '수량만 오류',
  success: '성공 응답',
}

export function matchesScenario(
  state: FormState,
  scenario: ExpectedScenario,
  isPending: boolean,
): boolean | undefined {
  if (isPending || state.status === 'idle') return undefined
  if (!state.fields) return false
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.fields.email.trim())
  const quantity = Number(state.fields.quantity)
  const quantityValid = state.fields.quantity.trim() !== '' &&
    Number.isInteger(quantity) && quantity >= 1 && quantity <= 10
  const actualErrorKeys = Object.keys(state.errors).sort().join(',')

  if (scenario === 'success') {
    return state.status === 'success' && emailValid && quantityValid &&
      actualErrorKeys === '' && state.data?.email === state.fields.email.trim() &&
      state.data.quantity === quantity
  }
  const expectsEmail = scenario !== 'quantity-error'
  const expectsQuantity = scenario !== 'email-error'
  const expectedKeys = [expectsEmail ? 'email' : '', expectsQuantity ? 'quantity' : '']
    .filter(Boolean).join(',')
  return state.status === 'error' && state.data === null &&
    emailValid === !expectsEmail && quantityValid === !expectsQuantity &&
    actualErrorKeys === expectedKeys &&
    (!expectsEmail || Boolean(state.errors.email?.trim())) &&
    (!expectsQuantity || Boolean(state.errors.quantity?.trim()))
}
