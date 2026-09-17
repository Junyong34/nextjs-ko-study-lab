import type { Attempt, OrderInput, OrderResult } from './types'

function sameInput(a: OrderInput | null, b: OrderInput) {
  return a?.requestId === b.requestId && a.productId === b.productId && a.quantity === b.quantity
}

export function verifyAttempt(attempt: Attempt | null, result: OrderResult | null): boolean | undefined {
  if (!attempt) return undefined
  if (!result || !sameInput(result.input, attempt.input)) return false
  const observations = attempt.observations
  const first = observations[0]
  const last = observations.at(-1)
  const busyIndex = observations.findIndex(o => o.pending && o.disabled && sameInput(o.input, attempt.input))
  const lifecycle = observations.length >= 3 && first?.pending === false && first.disabled === false &&
    first.input === null && busyIndex > 0 && busyIndex < observations.length - 1 &&
    last?.pending === false && last.disabled === false && last.input === null &&
    observations.every(o => !o.outsidePending)
  const quantity = Number(attempt.input.quantity)
  const valid = attempt.input.quantity.trim() !== '' && Number.isInteger(quantity) && quantity >= 1 && quantity <= 10
  const response = valid
    ? result.status === 'success' && Object.keys(result.errors).length === 0
    : result.status === 'error' && Boolean(result.errors.quantity) &&
      !result.errors.productId && !result.errors.requestId
  return Boolean(lifecycle && response)
}
