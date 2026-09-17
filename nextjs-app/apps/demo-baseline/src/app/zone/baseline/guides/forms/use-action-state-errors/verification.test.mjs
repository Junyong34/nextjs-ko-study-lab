import assert from 'node:assert/strict'
import test from 'node:test'
import { matchesScenario } from './verification.ts'

const idle = { status: 'idle', fields: null, errors: {}, data: null }
const rejected = {
  status: 'error', fields: { email: 'invalid-email', quantity: '0' },
  errors: { email: '이메일 오류', quantity: '수량 오류' }, data: null,
}
const accepted = {
  status: 'success', fields: { email: 'customer@example.com', quantity: '2' },
  errors: {}, data: { email: 'customer@example.com', quantity: 2 },
}

test('initial/reset and pending wait; expected errors pass but do not count as success', () => {
  assert.equal(matchesScenario(idle, 'both-errors', false), undefined)
  assert.equal(matchesScenario(accepted, 'success', true), undefined)
  assert.equal(matchesScenario(rejected, 'both-errors', false), true)
  assert.equal(matchesScenario(rejected, 'success', false), false)
  assert.equal(matchesScenario(accepted, 'success', false), true)
  assert.equal(matchesScenario(accepted, 'both-errors', false), false)
})

test('checks exact error fields and rejects inconsistent or stale successful results', () => {
  assert.equal(matchesScenario({ ...rejected, errors: { email: '오류' } }, 'both-errors', false), false)
  assert.equal(matchesScenario({ ...accepted, data: { email: 'other@example.com', quantity: 2 } }, 'success', false), false)
  assert.equal(matchesScenario({ ...accepted, data: { email: 'customer@example.com', quantity: 3 } }, 'success', false), false)
  assert.equal(matchesScenario({ ...accepted, fields: rejected.fields }, 'success', false), false)
  assert.equal(matchesScenario({ ...rejected, fields: accepted.fields }, 'both-errors', false), false)
  assert.equal(matchesScenario({ ...rejected, data: accepted.data }, 'both-errors', false), false)
  assert.equal(matchesScenario({ ...accepted, errors: { email: '오류' } }, 'success', false), false)
  assert.equal(matchesScenario({ ...rejected, fields: { email: 'bad', quantity: '2' }, errors: { email: '오류' } }, 'email-error', false), true)
  assert.equal(matchesScenario({ ...rejected, fields: { email: 'a@b.com', quantity: '0' }, errors: { quantity: '오류' } }, 'quantity-error', false), true)
})
