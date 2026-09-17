import assert from 'node:assert/strict'
import test from 'node:test'
import { verifyAttempt } from './verification.ts'

const input = { requestId: '2', productId: 'prod-001', quantity: '2' }
const idle = { pending: false, disabled: false, outsidePending: false, input: null }
const busy = { pending: true, disabled: true, outsidePending: false, input }
const attempt = { input, observations: [idle, busy, idle] }
const result = { status: 'success', input, errors: {} }

test('requires this submission idle → pending with data and disabled → idle plus its response', () => {
  assert.equal(verifyAttempt(null, null), undefined)
  assert.equal(verifyAttempt(attempt, null), false)
  assert.equal(verifyAttempt(attempt, result), true)
  for (const observations of [[idle], [busy, idle], [idle, busy], [idle, idle],
    [idle, { ...busy, disabled: false }, idle],
    [idle, busy, { ...idle, disabled: true }],
    [idle, busy, { ...idle, input }],
    [idle, { ...busy, outsidePending: true }, idle],
    [idle, { ...busy, input: { ...input, requestId: '1' } }, idle]]) {
    assert.equal(verifyAttempt({ input, observations }, result), false)
  }
  assert.equal(verifyAttempt(attempt, { ...result, input: { ...input, requestId: '1' } }), false)
  assert.equal(verifyAttempt(attempt, { ...result, input: { ...input, quantity: '3' } }), false)
  assert.equal(verifyAttempt({ input: { ...input, requestId: '3' }, observations: attempt.observations }, result), false)
})

test('expected quantity rejection passes learning verification but is never order success', () => {
  const invalid = { ...input, quantity: '0' }
  const rejected = { status: 'error', input: invalid, errors: { quantity: '수량 오류' } }
  const observed = { input: invalid, observations: [idle, { ...busy, input: invalid }, idle] }
  assert.equal(verifyAttempt(observed, rejected), true)
  assert.equal(verifyAttempt(observed, { ...rejected, status: 'success', errors: {} }), false)
  assert.equal(verifyAttempt(observed, { ...rejected, errors: { productId: '상품 오류' } }), false)
  assert.equal(verifyAttempt(attempt, { ...result, status: 'error', errors: { quantity: '오류' } }), false)
})
