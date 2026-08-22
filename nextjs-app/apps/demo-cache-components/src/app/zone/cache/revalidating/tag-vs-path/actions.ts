'use server'

import { revalidateTag, revalidatePath } from 'next/cache'

const PAGE_PATH = '/zone/cache/revalidating/tag-vs-path'

/**
 * 1. revalidateTag: 'tag-vs-path:product-a' 태그가 붙은 A 상품 캐시만 정밀 무효화
 */
export async function revalidateProductATag() {
  revalidateTag('tag-vs-path:product-a', 'max')
}

/**
 * 2. revalidateTag: 'tag-vs-path:product-b' 태그가 붙은 B 상품 캐시만 정밀 무효화
 */
export async function revalidateProductBTag() {
  revalidateTag('tag-vs-path:product-b', 'max')
}

/**
 * 3. revalidatePath: 해당 경로의 모든 캐시 블록(상단 배너 + A 상품 + B 상품)을 일괄 무효화
 */
export async function revalidateEntirePath() {
  revalidatePath(PAGE_PATH)
}
