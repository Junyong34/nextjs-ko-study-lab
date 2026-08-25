'use server'

import { revalidateTag } from 'next/cache'
import type { ProductSummary, TagPurgeResult } from './types'

let productDb: ProductSummary[] = [
  { id: 'p-101', name: '스마트 에어프라이어 5L', price: 89000, stock: 15, tag: 'products', cachedAt: new Date().toLocaleTimeString() },
  { id: 'p-102', name: '초고속 무선 충전기 3in1', price: 45000, stock: 42, tag: 'products', cachedAt: new Date().toLocaleTimeString() },
]

let purgeCounter = 0

export async function getCachedProducts(): Promise<TagPurgeResult> {
  return {
    tag: 'products',
    status: 'FRESH',
    products: [...productDb],
    purgedAt: productDb[0]?.cachedAt || new Date().toLocaleTimeString(),
    purgeCount: purgeCounter,
  }
}

export async function revalidateProductsTagAction(): Promise<TagPurgeResult> {
  purgeCounter += 1
  const newTime = new Date().toLocaleTimeString()

  // 가격/재고 변동 시뮬레이션
  productDb = productDb.map((p) => ({
    ...p,
    price: p.price + (Math.random() > 0.5 ? 1000 : -1000),
    stock: Math.max(1, p.stock + Math.floor(Math.random() * 5) - 2),
    cachedAt: newTime,
  }))

  // Next.js 16 공식 캐시 태그 무효화 트리거 (tag, profile)
  revalidateTag('products', 'max')

  return {
    tag: 'products',
    status: 'PURGED_AND_REGENERATED',
    products: [...productDb],
    purgedAt: newTime,
    purgeCount: purgeCounter,
  }
}
