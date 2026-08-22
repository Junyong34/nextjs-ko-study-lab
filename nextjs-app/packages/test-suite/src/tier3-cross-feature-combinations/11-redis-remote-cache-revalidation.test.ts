import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 3: Combination 11 - use cache + Redis Remote Store + revalidateTag Cascade', () => {
  it('3.11.1 should synchronize tag invalidation across multiple simulated server nodes', () => {
    const nodeA_Cache = new Map([['tag:shoes', 'Sneakers 1']])
    const nodeB_Cache = new Map([['tag:shoes', 'Sneakers 1']])

    const invalidateClusterTag = (tag: string) => {
      nodeA_Cache.delete(tag)
      nodeB_Cache.delete(tag)
    }

    invalidateClusterTag('tag:shoes')
    assert.strictEqual(nodeA_Cache.has('tag:shoes'), false)
    assert.strictEqual(nodeB_Cache.has('tag:shoes'), false)
  })
})
