import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 3: Combination 3 - Dynamic Slugs [...slug] + useSearchParams + use cache + cacheTag', () => {
  it('3.3.1 should compute composite cache key from dynamic slug hierarchy and search query parameters', () => {
    const slug = ['apparel', 'mens', 'jackets']
    const searchParams = new URLSearchParams('size=L&color=black&sort=price_asc')
    
    const generateCacheKey = (s: string[], sp: URLSearchParams) => {
      const sortedParams = Array.from(sp.entries()).sort(([a], [b]) => a.localeCompare(b))
      const queryStr = sortedParams.map(([k, v]) => `${k}=${v}`).join('&')
      return `category:${s.join('/')}?${queryStr}`
    }

    const key = generateCacheKey(slug, searchParams)
    assert.strictEqual(key, 'category:apparel/mens/jackets?color=black&size=L&sort=price_asc')
  })

  it('3.3.2 should purge cached category results when revalidateTag is triggered for parent category', () => {
    const cacheStore = new Map<string, { data: string; tags: string[] }>([
      ['key1', { data: 'Jackets List', tags: ['cat:apparel', 'cat:apparel/mens/jackets'] }],
      ['key2', { data: 'Shoes List', tags: ['cat:apparel', 'cat:apparel/mens/shoes'] }],
      ['key3', { data: 'Laptops List', tags: ['cat:electronics'] }],
    ])

    const revalidateTag = (targetTag: string) => {
      for (const [key, val] of Array.from(cacheStore.entries())) {
        if (val.tags.includes(targetTag)) {
          cacheStore.delete(key)
        }
      }
    }

    revalidateTag('cat:apparel')
    assert.strictEqual(cacheStore.has('key1'), false)
    assert.strictEqual(cacheStore.has('key2'), false)
    assert.strictEqual(cacheStore.has('key3'), true)
  })
})
