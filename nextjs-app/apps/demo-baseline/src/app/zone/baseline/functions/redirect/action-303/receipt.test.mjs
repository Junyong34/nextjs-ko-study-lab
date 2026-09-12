import test from 'node:test'
import assert from 'node:assert/strict'
import { validateOrder, readReceipt } from './receipt.ts'

const products = ['prod-001', 'prod-002']
const now = 1800000000000
const id = '32b582d2-e920-4b52-a413-b520149be553'
const receipt = { receiptId: id, productId: products[0], quantity: 2, issuedAt: now - 1000 }
const read = (value, receiptId = id) => readReceipt(JSON.stringify(value), receiptId, products, now)

test('accepts an allowed product and integer quantities from 1 through 10', () => {
  for (const quantity of ['1', '2', '10']) {
    assert.deepEqual(validateOrder(products[0], quantity, products), { productId: products[0], quantity: Number(quantity) })
  }
})

test('rejects unknown products and invalid or non-integer quantities', () => {
  assert.equal(validateOrder('unknown', '2', products), null)
  for (const quantity of ['', '0', '-1', '11', '1.5', 'NaN', 'Infinity', null]) {
    assert.equal(validateOrder(products[0], quantity, products), null)
  }
})

test('returns the stored receipt only when the URL id and valid cookie agree', () => {
  assert.deepEqual(read(receipt), { receipt, error: null })
})

test('rejects missing, malformed and non-object cookies', () => {
  for (const raw of [undefined, '', '{', 'null', '[]', '42']) {
    assert.equal(readReceipt(raw, id, products, now).receipt, null)
  }
})

test('rejects missing, repeated and mismatched URL ids', () => {
  for (const receiptId of [undefined, '', [id, id], 'bfa1cf81-89b4-4d83-b9e9-74d183c61a5f']) {
    assert.equal(readReceipt(JSON.stringify(receipt), receiptId, products, now).receipt, null)
  }
})

test('rejects expired, future and malformed issue dates', () => {
  for (const issuedAt of [now - 600000, now + 1, 'yesterday', null]) {
    assert.equal(read({ ...receipt, issuedAt }).receipt, null)
  }
})

test('rejects invalid stored product, quantity and receipt id', () => {
  for (const patch of [{ productId: 'unknown' }, { quantity: 0 }, { quantity: 11 }, { quantity: 1.5 }, { quantity: '2' }, { receiptId: 'bad-id' }]) {
    assert.equal(read({ ...receipt, ...patch }).receipt, null)
  }
})
