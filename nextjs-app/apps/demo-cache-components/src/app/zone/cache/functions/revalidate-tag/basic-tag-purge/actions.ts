'use server'

import { revalidateTag } from 'next/cache'
import type { InventoryItem, InventoryTagPurgeResult } from './types'

let inventoryDb: InventoryItem[] = [
  { sku: 'SKU-HD01', name: '노이즈캔슬링 무선 헤드폰', stock: 8, location: '물류센터 A (김포)', lastSync: '초기 로드' },
  { sku: 'SKU-MS02', name: 'RGB 초경량 게이밍 마우스', stock: 24, location: '물류센터 B (이천)', lastSync: '초기 로드' },
]

let versionCounter = 1

export async function purgeInventoryTagAction(): Promise<InventoryTagPurgeResult> {
  versionCounter += 1
  const time = new Date().toLocaleTimeString()
  const versionId = `v${versionCounter}-${Math.random().toString(36).substring(2, 6)}`

  // 재고 변동 시뮬레이션
  inventoryDb = inventoryDb.map((item) => ({
    ...item,
    stock: Math.max(1, item.stock - Math.floor(Math.random() * 2 + 1)),
    lastSync: time,
  }))

  // Next.js 16 공식 revalidateTag 호출 (tag, profile)
  revalidateTag('inventory', 'max')

  return {
    tag: 'inventory',
    versionId,
    status: 'PURGED',
    items: [...inventoryDb],
    timestamp: time,
  }
}
