'use server'

import { revalidateTag } from 'next/cache'
import type { InventoryTagPurgeResult } from './types'
import { TAGS } from './tags'
import { applyRandomStockDrop } from './inventoryStore'

let versionCounter = 1

export async function purgeInventoryTagAction(): Promise<InventoryTagPurgeResult> {
  versionCounter += 1
  const time = new Date().toLocaleTimeString()
  const versionId = `v${versionCounter}-${Math.random().toString(36).substring(2, 6)}`

  const items = applyRandomStockDrop(time)

  // Next.js 16 공식 revalidateTag 호출 (tag, profile) — 'inventory' 태그가 붙은 캐시를 stale로 표시
  revalidateTag(TAGS.inventory, 'max')

  return {
    tag: TAGS.inventory,
    versionId,
    status: 'PURGED',
    items: [...items],
    timestamp: time,
  }
}
