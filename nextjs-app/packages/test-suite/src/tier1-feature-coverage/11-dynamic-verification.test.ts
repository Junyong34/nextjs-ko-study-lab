import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { computeExpectedActualMatch } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 11 - Dynamic ExpectedActualPanel Verification', () => {
  it('11.1 should evaluate to undefined (대기 중) when actual or expected is omitted', () => {
    const match1 = computeExpectedActualMatch(undefined, 'value')
    const match2 = computeExpectedActualMatch('value', undefined)
    assert.strictEqual(match1, undefined)
    assert.strictEqual(match2, undefined)
  })

  it('11.2 should evaluate to true (검증 완료) when string values match after trimming', () => {
    const match = computeExpectedActualMatch('  HTTP 200 OK  ', 'HTTP 200 OK')
    assert.strictEqual(match, true)
  })

  it('11.3 should evaluate to false (불일치) when values differ', () => {
    const match = computeExpectedActualMatch('Total: 50,000원', 'Total: 45,000원')
    assert.strictEqual(match, false)
  })

  it('11.4 should compare numeric equality accurately', () => {
    assert.strictEqual(computeExpectedActualMatch(150, 150), true)
    assert.strictEqual(computeExpectedActualMatch(150, 151), false)
  })

  it('11.5 should support deep object serialization comparison', () => {
    const expected = { status: 'success', itemsCount: 3 }
    const actual = { status: 'success', itemsCount: 3 }
    assert.strictEqual(computeExpectedActualMatch(expected, actual), true)

    const mismatched = { status: 'error', itemsCount: 0 }
    assert.strictEqual(computeExpectedActualMatch(expected, mismatched), false)
  })
})
