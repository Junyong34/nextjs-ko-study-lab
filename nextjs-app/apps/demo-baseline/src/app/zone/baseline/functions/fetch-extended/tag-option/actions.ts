'use server'

import { revalidateTag } from 'next/cache'
import { PRODUCT_TAGS } from './types'
import type { PurgeResult } from './types'

/**
 * Next.js 16.3.2부터 revalidateTag(tag)의 단일 인자 호출은 deprecated다.
 * { expire: 0 }은 즉시 만료(다음 요청이 블로킹 재검증/캐시 미스)를 의미한다.
 * ('max' 프로파일을 쓰면 stale-while-revalidate로 한 번 더 방문해야 새 값이 보인다.)
 */
export async function purgeShoesTagAction(): Promise<PurgeResult> {
  revalidateTag(PRODUCT_TAGS.shoes, { expire: 0 })
  return { tag: PRODUCT_TAGS.shoes, purgedAt: new Date().toISOString() }
}

export async function purgeWindbreakerTagAction(): Promise<PurgeResult> {
  revalidateTag(PRODUCT_TAGS.windbreaker, { expire: 0 })
  return { tag: PRODUCT_TAGS.windbreaker, purgedAt: new Date().toISOString() }
}

export async function purgeBothTagsAction(): Promise<PurgeResult[]> {
  revalidateTag(PRODUCT_TAGS.shoes, { expire: 0 })
  revalidateTag(PRODUCT_TAGS.windbreaker, { expire: 0 })
  const purgedAt = new Date().toISOString()
  return [
    { tag: PRODUCT_TAGS.shoes, purgedAt },
    { tag: PRODUCT_TAGS.windbreaker, purgedAt },
  ]
}
