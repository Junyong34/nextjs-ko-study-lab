import assert from 'node:assert/strict'
import test from 'node:test'
import { validateOrder } from './validation.ts'

test('server rejects invalid quantities and accepts integer boundaries', () => {
  for (const quantity of ['', '0', '-1', '1.5', '11', 'abc']) {
    const data = new FormData()
    data.set('quantity', quantity)
    data.set('requestId', '1')
    data.set('productId', 'prod-001')
    const result = validateOrder(data, 'prod-001')
    assert.equal(result.status, 'error', quantity)
    assert.ok(result.errors.quantity)
    assert.equal(result.input.quantity, quantity)
  }
  for (const quantity of ['1', '2', '10']) {
    const data = new FormData()
    data.set('quantity', quantity)
    data.set('requestId', '2')
    data.set('productId', 'prod-001')
    assert.equal(validateOrder(data, 'prod-001').status, 'success')
    data.set('productId', 'unknown')
    assert.equal(validateOrder(data, 'prod-001').status, 'error')
  }
})
