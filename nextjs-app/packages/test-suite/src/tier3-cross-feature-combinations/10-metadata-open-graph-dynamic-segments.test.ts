import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 3: Combination 10 - Dynamic [id] Route + generateMetadata + OpenGraph + Sitemap', () => {
  it('3.10.1 should dynamically generate OpenGraph title and image from resolved product ID', async () => {
    const generateMetadata = async (props: { params: Promise<{ id: string }> }) => {
      const { id } = await props.params
      return {
        title: `Product ${id} | Study Lab Store`,
        openGraph: {
          title: `Product ${id}`,
          images: [`/og-images/${id}.webp`],
        },
      }
    }

    const meta = await generateMetadata({ params: Promise.resolve({ id: 'SKU-777' }) })
    assert.strictEqual(meta.title, 'Product SKU-777 | Study Lab Store')
    assert.deepStrictEqual(meta.openGraph.images, ['/og-images/SKU-777.webp'])
  })
})
