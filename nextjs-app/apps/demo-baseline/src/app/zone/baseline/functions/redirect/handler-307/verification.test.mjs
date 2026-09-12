import assert from 'node:assert/strict'
import test from 'node:test'
import { parseOrderInput, verifyRedirect } from './verification.ts'

const submitted = { method: 'POST', productId: 'prod-001', quantity: 2, requestId: 'request-1' }
const target = 'https://study.example/zone/baseline/functions/redirect/handler-307/receipt'
const receipt = { method: 'POST', source: 'body', productId: 'prod-001', quantity: 2, requestId: 'request-1' }
const observed = { status: 200, redirected: true, url: target, receipt }

test('POST redirect succeeds only when the receiving request matches the submitted order', () => {
  assert.equal(verifyRedirect(submitted, observed, target).isMatched, true)
})

for (const [label, change] of [
  ['failed HTTP response', { status: 400 }],
  ['no redirect', { redirected: false }],
  ['different origin', { url: target.replace('study.example', 'other.example') }],
  ['different receipt path', { url: `${target}/other` }],
  ['invalid final URL', { url: 'not a url' }],
  ['missing receipt', { receipt: null }],
  ['GET receipt', { receipt: { ...receipt, method: 'GET' } }],
  ['query instead of body', { receipt: { ...receipt, source: 'query' } }],
  ['different product', { receipt: { ...receipt, productId: 'prod-002' } }],
  ['different quantity', { receipt: { ...receipt, quantity: 3 } }],
  ['stale request', { receipt: { ...receipt, requestId: 'previous-request' } }],
]) {
  test(`does not report POST success for ${label}`, () => {
    assert.equal(verifyRedirect(submitted, { ...observed, ...change }, target).isMatched, false)
  })
}

test('GET preserved as GET is a comparison mismatch against the POST learning goal', () => {
  const result = verifyRedirect({ ...submitted, method: 'GET' }, {
    ...observed, receipt: { ...receipt, method: 'GET', source: 'query' },
  }, target)
  assert.equal(result.isMatched, false)
  assert.match(result.reason, /GET.*POST/)
})

test('input validation accepts an allowed product and integer quantity', () => {
  assert.deepEqual(parseOrderInput(receipt, ['prod-001']), {
    productId: 'prod-001', quantity: 2, requestId: 'request-1',
  })
})

for (const input of [null, {}, { ...receipt, productId: 'unknown' },
  { ...receipt, quantity: 0 }, { ...receipt, quantity: 11 },
  { ...receipt, quantity: 1.5 }, { ...receipt, quantity: '2' },
  { ...receipt, requestId: '' }, { ...receipt, requestId: ' ' }]) {
  test(`rejects invalid order ${JSON.stringify(input)}`, () => {
    assert.equal(parseOrderInput(input, ['prod-001']), null)
  })
}
