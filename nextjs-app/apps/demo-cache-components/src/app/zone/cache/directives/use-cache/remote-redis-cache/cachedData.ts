import { cacheTag } from 'next/cache'
import { TAGS } from './tags'
import { getRemoteStockState } from './stockStore'
import type { RemoteStockSnapshot } from './types'

export async function getRemoteStockSnapshot(): Promise<RemoteStockSnapshot> {
  'use cache: remote'
  cacheTag(TAGS.stock)

  const { stock, totalPurchases } = getRemoteStockState()

  // cacheId는 이 함수가 실제로 "다시 실행"됐을 때만 새로 생성된다.
  // 캐시 HIT라면 여러 호출부가 같은 cacheId를 그대로 공유해서 받는다.
  return {
    stock,
    totalPurchases,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}
