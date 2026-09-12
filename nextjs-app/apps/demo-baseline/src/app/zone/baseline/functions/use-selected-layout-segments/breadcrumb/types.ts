import { MOCK_PRODUCTS } from '@study/demo-kit'
import type { Product } from '@study/demo-kit'

/** 이 데모의 실제 기본 라우트 경로. category/[category]/[id] 서브 라우트가 이 경로 아래 물리적 디렉토리로 존재한다. */
export const BASE_PATH = '/zone/baseline/functions/use-selected-layout-segments/breadcrumb'

export interface CategoryInfo {
  slug: string
  name: string
}

/** MOCK_PRODUCTS에 등장하는 카테고리를 중복 없이 추출한다. 카테고리 목록을 별도로 하드코딩하지 않는다. */
export const CATEGORIES: CategoryInfo[] = MOCK_PRODUCTS.reduce<CategoryInfo[]>((acc, product) => {
  if (!acc.some((c) => c.slug === product.category)) {
    acc.push({ slug: product.category, name: product.categoryName })
  }
  return acc
}, [])

export function getCategoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug
}

export function getProductsByCategory(slug: string): Product[] {
  return MOCK_PRODUCTS.filter((product) => product.category === slug)
}

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.id === id)
}
