import { cacheLife, cacheTag } from 'next/cache'
import type { CachedHeroBanner } from './types'

export async function getHeroBannerCache(): Promise<CachedHeroBanner> {
  'use cache'
  cacheTag('guides-isr-cache-components-cache-life-hours:hero-banner')
  cacheLife('hours')

  return {
    bannerId: 'promo-spring-2026',
    title: '2026 봄맞이 프리미엄 스포츠 웨어 기획전',
    subtitle: '신규 회원 전 품목 30% 즉시 할인 쿠폰 지급',
    discountRate: '30% OFF',
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    cachedAt: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    }),
  }
}
