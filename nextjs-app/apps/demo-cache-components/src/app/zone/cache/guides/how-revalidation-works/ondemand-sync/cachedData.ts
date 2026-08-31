import { cacheTag } from 'next/cache'
import { productStore } from './store'

export async function getCachedProducts() {
  'use cache'
  cacheTag('products')

  const cacheId = Math.random().toString(36).slice(2, 8).toUpperCase()
  return {
    tag: 'products',
    cacheId,
    generatedAt: new Date().toLocaleTimeString(),
    products: productStore.map((p) => ({ ...p })),
  }
}
