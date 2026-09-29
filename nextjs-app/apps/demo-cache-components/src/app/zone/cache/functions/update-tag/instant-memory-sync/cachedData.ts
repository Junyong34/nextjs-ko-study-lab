import { cacheTag } from 'next/cache'
import { TAGS } from './tags'
import { getUpdateTagCartQty, getRevalidateTagCartQty } from './cartStore'
import type { CartQtySnapshot } from './types'

export async function getUpdateTagCartCache(): Promise<CartQtySnapshot> {
  'use cache'
  cacheTag(TAGS.updateTagCart)

  return {
    qty: getUpdateTagCartQty(),
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}

export async function getRevalidateTagCartCache(): Promise<CartQtySnapshot> {
  'use cache'
  cacheTag(TAGS.revalidateTagCart)

  return {
    qty: getRevalidateTagCartQty(),
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}
