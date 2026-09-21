import { cacheTag } from 'next/cache'
import { TAGS } from './tags'
import { inventoryDb } from './inventoryStore'

export async function getInventoryCache() {
  'use cache'
  cacheTag(TAGS.inventory)

  return {
    items: [...inventoryDb],
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}
