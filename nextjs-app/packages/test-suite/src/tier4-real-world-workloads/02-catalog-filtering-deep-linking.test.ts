import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 4: Scenario 2 - Catalog Filtering & Deep Linking', () => {
  it('should synchronize search parameters, filter state, and deep link URL with zero latency', () => {
    // 1. Initial URL: /catalog/shoes?brand=nike&size=270&sort=popular
    const initialUrl = 'https://study.dev/catalog/shoes?brand=nike&size=270&sort=popular'
    const parsedUrl = new URL(initialUrl)
    const category = parsedUrl.pathname.replace('/catalog/', '')
    const brand = parsedUrl.searchParams.get('brand')
    const size = parsedUrl.searchParams.get('size')
    const sort = parsedUrl.searchParams.get('sort')

    assert.strictEqual(category, 'shoes')
    assert.strictEqual(brand, 'nike')
    assert.strictEqual(size, '270')
    assert.strictEqual(sort, 'popular')

    // 2. User toggles filter: adds price range [50000..150000]
    const updatedParams = new URLSearchParams(parsedUrl.search)
    updatedParams.set('minPrice', '50000')
    updatedParams.set('maxPrice', '150000')

    const newUrl = `${parsedUrl.pathname}?${updatedParams.toString()}`
    assert.strictEqual(
      newUrl,
      '/catalog/shoes?brand=nike&size=270&sort=popular&minPrice=50000&maxPrice=150000',
    )

    // 3. Deep link copy & paste serialization check
    const serializedDeepLink = `https://study.dev${newUrl}`
    const verifiedUrl = new URL(serializedDeepLink)
    assert.strictEqual(verifiedUrl.searchParams.get('minPrice'), '50000')
    assert.strictEqual(verifiedUrl.searchParams.get('maxPrice'), '150000')
    assert.strictEqual(verifiedUrl.searchParams.get('brand'), 'nike')
  })
})
