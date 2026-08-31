import { cacheTag } from 'next/cache'

export async function getProduct101Cache() {
  'use cache'
  cacheTag('product-101', 'category-electronics')
  return {
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}

export async function getProduct205Cache() {
  'use cache'
  cacheTag('product-205', 'category-electronics')
  return {
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}
