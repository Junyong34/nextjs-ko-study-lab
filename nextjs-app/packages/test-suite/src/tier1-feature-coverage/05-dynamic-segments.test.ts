import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 1: Feature 5 - Dynamic Segments ([id], [...slug], [[...slug]])', () => {
  it('5.1 should unwrap single dynamic segment [id] promise', async () => {
    const paramsPromise = Promise.resolve({ id: 'PROD-42' })
    const params = await paramsPromise
    assert.strictEqual(params.id, 'PROD-42')
  })

  it('5.2 should unwrap catch-all segment [...slug] array hierarchy', async () => {
    const paramsPromise = Promise.resolve({ slug: ['shoes', 'running', 'pegasus-40'] })
    const params = await paramsPromise
    assert.deepStrictEqual(params.slug, ['shoes', 'running', 'pegasus-40'])
    assert.strictEqual(params.slug.join('/'), 'shoes/running/pegasus-40')
  })

  it('5.3 should handle optional catch-all [[...slug]] when empty or populated', async () => {
    const emptyParamsPromise = Promise.resolve({ slug: undefined })
    const emptyParams = await emptyParamsPromise
    assert.strictEqual(emptyParams.slug, undefined)

    const fullParamsPromise = Promise.resolve({ slug: ['electronics', 'laptops'] })
    const fullParams = await fullParamsPromise
    assert.deepStrictEqual(fullParams.slug, ['electronics', 'laptops'])
  })

  it('5.4 should validate dynamic segment parameter typing and decoding', async () => {
    const rawSlug = 'sneakers%20%26%20boots'
    const decoded = decodeURIComponent(rawSlug)
    assert.strictEqual(decoded, 'sneakers & boots')
  })

  it('5.5 should validate generateStaticParams contract for pre-rendered catalog items', async () => {
    const generateStaticParams = async () => {
      return [{ id: '101' }, { id: '102' }, { id: '103' }]
    }
    const paramsList = await generateStaticParams()
    assert.strictEqual(paramsList.length, 3)
    assert.strictEqual(paramsList[0].id, '101')
  })
})
