'use server'

import { revalidateTag } from 'next/cache'
import { TAGS } from './tags'
import { applyRemotePurchase, applyRemoteRestock } from './stockStore'
import type { RemoteStockActionResult } from './types'

export async function purchaseRemoteStockAction(): Promise<RemoteStockActionResult> {
  const { stock, totalPurchases } = applyRemotePurchase()
  const timestamp = new Date().toLocaleTimeString()

  // Next.js 16 공식 revalidateTag(tag, profile) — 'remote-redis-cache:stock' 태그가 붙은
  // 공유 원격 캐시 풀 엔트리를 stale로 표시한다(stale-while-revalidate).
  revalidateTag(TAGS.stock, 'max')

  return { stock, totalPurchases, timestamp }
}

export async function restockRemoteStockAction(): Promise<RemoteStockActionResult> {
  const { stock, totalPurchases } = applyRemoteRestock()
  const timestamp = new Date().toLocaleTimeString()

  revalidateTag(TAGS.stock, 'max')

  return { stock, totalPurchases, timestamp }
}
