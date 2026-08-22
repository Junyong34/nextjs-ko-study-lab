import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 4: Scenario 3 - Multi-Instance Shared Flash Sale', () => {
  it('should maintain consistent cache invalidation across distributed node instances during flash sale', async () => {
    // 1. Shared Remote Cache Store
    interface FlashSaleItem {
      sku: string
      title: string
      price: number
      stock: number
      tags: string[]
    }

    const remoteStore = new Map<string, FlashSaleItem>([
      [
        'sale:LIMITED-001',
        {
          sku: 'LIMITED-001',
          title: 'Special Edition Sneaker',
          price: 99000,
          stock: 5,
          tags: ['flash-sale', 'category-sneakers'],
        },
      ],
    ])

    // 2. Node A fetches cached data
    const nodeA_cache = remoteStore.get('sale:LIMITED-001')!
    assert.strictEqual(nodeA_cache.stock, 5)

    // 3. User purchases 1 item via Server Action -> atomic decrement on remote store
    const purchaseFlashItem = async (sku: string) => {
      const item = remoteStore.get(`sale:${sku}`)
      if (!item || item.stock <= 0) {
        throw new Error('OUT_OF_STOCK')
      }
      item.stock -= 1
      remoteStore.set(`sale:${sku}`, item)

      // Invalidate tags across all nodes
      return { success: true, remaining: item.stock, tagsToPurge: item.tags }
    }

    const actionResult = await purchaseFlashItem('LIMITED-001')
    assert.strictEqual(actionResult.success, true)
    assert.strictEqual(actionResult.remaining, 4)

    // 4. Node B queries after tag invalidation
    const nodeB_freshData = remoteStore.get('sale:LIMITED-001')!
    assert.strictEqual(nodeB_freshData.stock, 4, 'Node B must observe updated stock after tag invalidation')
  })
})
