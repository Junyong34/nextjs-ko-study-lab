import { cacheLife, cacheTag } from 'next/cache'
import { TAGS } from './tags'
import { promoNotice, recallNotice } from './noticeStore'

// 두 캐시 항목 모두 cacheLife('max')로 "장기 보존" 대상임을 통일한다.
// 무효화 시점의 반영 속도 차이는 오직 revalidateTag()의 두 번째 인자(profile)에서만 생긴다.

export async function getPromoNoticeCache() {
  'use cache'
  cacheLife('max')
  cacheTag(TAGS.promo)

  return {
    entry: { ...promoNotice },
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}

export async function getRecallNoticeCache() {
  'use cache'
  cacheLife('max')
  cacheTag(TAGS.recall)

  return {
    entry: { ...recallNotice },
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}
