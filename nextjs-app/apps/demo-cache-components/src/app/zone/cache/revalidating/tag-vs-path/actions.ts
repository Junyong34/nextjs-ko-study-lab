'use server'

import { updateTag, revalidatePath } from 'next/cache'

const PAGE_PATH = '/zone/cache/revalidating/tag-vs-path'

/**
 * 1. updateTag: 'tag-vs-path:product-a' 태그가 붙은 A 상품 캐시만 정밀 무효화 후 즉시 재조회
 * (revalidateTag(tag, 'max')는 stale-while-revalidate라 다음 방문 시점에야 갱신되어
 *  버튼 클릭 즉시 반영을 기대하는 Server Action에는 맞지 않음 — updateTag가 공식 권장값)
 */
export async function updateProductATag() {
  updateTag('tag-vs-path:product-a')
}

/**
 * 2. updateTag: 'tag-vs-path:product-b' 태그가 붙은 B 상품 캐시만 정밀 무효화 후 즉시 재조회
 */
export async function updateProductBTag() {
  updateTag('tag-vs-path:product-b')
}

/**
 * 3. revalidatePath: 해당 경로의 모든 캐시 블록(상단 배너 + A 상품 + B 상품)을 일괄 무효화
 */
export async function revalidateEntirePath() {
  revalidatePath(PAGE_PATH)
}
