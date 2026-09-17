import assert from 'node:assert/strict'
import test from 'node:test'
import { validateOrderFormAction } from './actions.ts'

const idle = { status: 'idle', errors: {}, fields: null, data: null }
function form(email, quantity) {
  const data = new FormData()
  if (email !== undefined) data.set('email', email)
  if (quantity !== undefined) data.set('quantity', quantity)
  return data
}

test('server returns both field errors and submitted values together', async () => {
  const state = await validateOrderFormAction(idle, form('invalid-email', '0'))
  assert.equal(state.status, 'error')
  assert.deepEqual(Object.keys(state.errors).sort(), ['email', 'quantity'])
  assert.deepEqual(state.fields, { email: 'invalid-email', quantity: '0' })
  assert.equal(state.data, null)
})

test('rejects missing, file, malformed email, fractional and out-of-range quantities', async () => {
  for (const email of [undefined, '', 'a@', '@b.com', 'a b@c.com', 'a@@b.com', new Blob(['email'])]) {
    const state = await validateOrderFormAction(idle, form(email, '2'))
    assert.equal(state.status, 'error')
    assert.deepEqual(Object.keys(state.errors), ['email'])
  }
  for (const quantity of [undefined, '', ' ', '0', '-1', '11', '1.5', 'NaN', 'Infinity', new Blob(['2'])]) {
    const state = await validateOrderFormAction(idle, form('customer@example.com', quantity))
    assert.equal(state.status, 'error')
    assert.deepEqual(Object.keys(state.errors), ['quantity'])
  }
})

test('error → corrected success → error replaces stale results and preserves input snapshot', async () => {
  const error = await validateOrderFormAction(idle, form('invalid-email', '0'))
  const success = await validateOrderFormAction(error, form(' customer@example.com ', '2'))
  assert.equal(success.status, 'success')
  assert.deepEqual(success.errors, {})
  assert.deepEqual(success.fields, { email: ' customer@example.com ', quantity: '2' })
  assert.deepEqual(success.data, { email: 'customer@example.com', quantity: 2 })
  const again = await validateOrderFormAction(success, form('invalid-email', '0'))
  assert.equal(again.status, 'error')
  assert.equal(again.data, null)
  for (const quantity of ['1', '10']) {
    assert.equal((await validateOrderFormAction(idle, form('customer@example.com', quantity))).status, 'success')
  }
})
