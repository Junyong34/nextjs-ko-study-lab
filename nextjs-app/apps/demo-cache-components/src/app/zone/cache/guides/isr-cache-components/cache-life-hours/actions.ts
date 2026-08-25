'use server'

import type { CachedHeroBanner } from './types'

let cachedBannerState: CachedHeroBanner | null = null

export async function fetchComponentCacheAction(forceFresh: boolean = false): Promise<CachedHeroBanner> {
  const start = Date.now()

  if (cachedBannerState && !forceFresh) {
    // 0ms HIT
    return {
      ...cachedBannerState,
      hitType: '0ms HIT',
      fetchLatencyMs: 0,
    }
  }

  // Initial Fetch simulation
  const newBanner: CachedHeroBanner = {
    bannerId: 'promo-spring-2026',
    title: '2026 봄맞이 프리미엄 스포츠 웨어 기획전',
    subtitle: '신규 회원 전 품목 30% 즉시 할인 쿠폰 지급',
    discountRate: '30% OFF',
    cachedAt: new Date().toLocaleTimeString(),
    hitType: 'INITIAL_FETCH',
    fetchLatencyMs: Date.now() - start + 45,
  }

  cachedBannerState = newBanner
  return newBanner
}
