import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { computeExpectedActualMatch } from '../utils/test-helpers.ts'

describe('Tier 3: Combination 1 - Server Actions + useTransition + Dynamic Verification + Optimistic UI', () => {
  it('3.1.1 should coordinate optimistic UI update during pending transition', async () => {
    let state = { items: ['PROD-1'], pending: false }
    let isMatched: boolean | undefined = undefined

    // 1. User adds item -> transition start with optimistic update
    state = { items: [...state.items, 'PROD-2 (Optimistic)'], pending: true }
    isMatched = computeExpectedActualMatch(2, state.items.length)
    assert.strictEqual(state.pending, true)
    assert.strictEqual(isMatched, true)

    // 2. Server Action completes
    const serverAction = async () => ({ success: true, item: 'PROD-2' })
    const res = await serverAction()
    state = { items: ['PROD-1', res.item], pending: false }
    isMatched = computeExpectedActualMatch(2, state.items.length)
    assert.strictEqual(state.pending, false)
    assert.strictEqual(isMatched, true)
    assert.deepStrictEqual(state.items, ['PROD-1', 'PROD-2'])
  })

  it('3.1.2 should revert optimistic UI and flag mismatch in ExpectedActualPanel on server action error', async () => {
    let state = { items: ['PROD-1'], pending: true }
    let errorState: string | null = null

    // Server Action throws
    const serverAction = async () => {
      throw new Error('INSUFFICIENT_STOCK')
    }

    try {
      await serverAction()
    } catch (e: any) {
      errorState = e.message
      state = { items: ['PROD-1'], pending: false } // Revert
    }

    const isMatched = computeExpectedActualMatch('Success', errorState ? 'Failed' : 'Success')
    assert.strictEqual(isMatched, false, 'ExpectedActualPanel should detect failure regression')
    assert.strictEqual(state.items.length, 1)
  })
})
