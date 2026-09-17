import assert from 'node:assert/strict'
import test from 'node:test'
import { EXPECTED_RETURN_URL, matchesReturnUrl } from './verification.ts'

test('waiting state has no returnUrl yet (undefined observation)', () => {
  assert.equal(matchesReturnUrl(undefined), false)
  assert.equal(matchesReturnUrl(''), false)
})

test('matches only the exact returnUrl produced by expireSessionAction()', () => {
  assert.equal(matchesReturnUrl(EXPECTED_RETURN_URL), true)
  assert.equal(matchesReturnUrl('/checkout'), true)
})

test('rejects any mismatch, including similar-looking or malformed values', () => {
  assert.equal(matchesReturnUrl('/checkout/'), false)
  assert.equal(matchesReturnUrl('/Checkout'), false)
  assert.equal(matchesReturnUrl('checkout'), false)
  assert.equal(matchesReturnUrl('/orders'), false)
  assert.equal(matchesReturnUrl('https://evil.com/checkout'), false)
  assert.equal(matchesReturnUrl('  /checkout  '), true)
})
