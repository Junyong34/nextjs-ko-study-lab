import { cacheTag } from 'next/cache'
import { TAGS } from './tags'

export async function getProductDetailCache() {
  'use cache'
  cacheTag(TAGS.product, TAGS.category, TAGS.brand)

  return {
    productName: '로지텍 MX Master 무선 마우스',
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}
