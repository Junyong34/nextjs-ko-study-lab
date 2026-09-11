import { MOCK_PRODUCTS } from '@study/demo-kit'

export const BASE_PATH = '/zone/baseline/functions/generate-static-params/multiple-segments'

/**
 * layout.tsx(부모 [category])와 page.tsx(자식 [id])의 generateStaticParams()가 실제로
 * 반환하는 값과, 카탈로그 UI가 표시하는 뱃지가 항상 같은 데이터를 가리키도록
 * 이 배열 하나에서 두 곳 모두 파생시킨다.
 */
export const PREBUILT_COMBINATIONS = MOCK_PRODUCTS.filter((product) => product.isBest).map((product) => ({
  category: product.category,
  id: product.id,
}))

/** 부모 [category] 세그먼트의 generateStaticParams()가 반환할 카테고리 목록 */
export const PREBUILT_CATEGORIES = Array.from(new Set(PREBUILT_COMBINATIONS.map((combo) => combo.category)))

export function isPrebuiltCombination(category: string, id: string): boolean {
  return PREBUILT_COMBINATIONS.some((combo) => combo.category === category && combo.id === id)
}
