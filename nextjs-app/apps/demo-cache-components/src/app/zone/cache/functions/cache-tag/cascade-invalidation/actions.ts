'use server'

import { updateTag } from 'next/cache'
import { TAGS, isCategoryId, isProductId } from './tags'

// updateTag: Server Action 전용, 태그를 즉시 만료시켜 이 액션의 응답 렌더가
// stale 값 없이 새로 계산된 값을 읽는다(read-your-own-writes).
// revalidateTag(tag, 'max')는 stale-while-revalidate라 첫 응답에 이전 값이 보일 수 있어
// "어떤 엔트리가 바뀌었는가"를 한 번의 클릭으로 비교하려는 이 데모에는 맞지 않는다.

/** 상위 태그: 이 태그를 가진 모든 엔트리(요약·목록·상품 전체)가 대상 */
export async function invalidateCatalogAction() {
  updateTag(TAGS.catalog)
}

/** 중간 태그: 해당 카테고리 목록 + 그 카테고리 상품들이 대상 */
export async function invalidateCategoryAction(id: string) {
  if (!isCategoryId(id)) throw new Error(`알 수 없는 카테고리: ${id}`)
  updateTag(TAGS.category(id))
}

/** 하위 태그: 해당 상품 상세 엔트리 하나만 대상 */
export async function invalidateProductAction(id: string) {
  if (!isProductId(id)) throw new Error(`알 수 없는 상품: ${id}`)
  updateTag(TAGS.product(id))
}
