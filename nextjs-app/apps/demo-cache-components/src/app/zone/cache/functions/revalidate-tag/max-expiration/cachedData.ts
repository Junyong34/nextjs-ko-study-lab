import { cacheTag } from 'next/cache'
import { ORIGIN_LATENCY_MS, PROFILES, nowStamp } from './tags'
import { readSourcePrice } from './priceStore'
import type { CachedPrice, ProfileId } from './types'

/**
 * 가격표 조회 캐시. 본문은 캐시 미스(또는 무효화 후 재계산) 때만 실행되므로
 * cacheId·generatedAt·version은 "이 엔트리가 마지막으로 계산된 순간"의 값이다.
 */
export async function getCachedPrice(id: ProfileId): Promise<CachedPrice> {
  'use cache'
  cacheTag(PROFILES[id].tag)

  // 느린 원본 DB 조회 대역: 재계산이 요청을 막는지(블로킹) 응답 시간으로 드러나게 한다
  await new Promise((resolve) => setTimeout(resolve, ORIGIN_LATENCY_MS))
  const at = nowStamp()
  return {
    version: readSourcePrice(id).version,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: at.label,
    generatedAtMs: at.ms,
  }
}
