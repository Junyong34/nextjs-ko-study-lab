import type { CategoryId, ProductId } from './types'

// 태그는 앱 전역이므로 데모 접두사를 붙인다 (apps/AGENTS.md 8항)
const PREFIX = 'cascade-invalidation'

export const CATEGORIES: Record<CategoryId, { name: string; products: ProductId[] }> = {
  keyboard: { name: '키보드', products: ['k1', 'k2'] },
  mouse: { name: '마우스', products: ['m1', 'm2'] },
}

export const PRODUCTS: Record<ProductId, { name: string; category: CategoryId; price: number }> = {
  k1: { name: '로우프로파일 무선 키보드', category: 'keyboard', price: 89000 },
  k2: { name: '기계식 텐키리스 키보드', category: 'keyboard', price: 129000 },
  m1: { name: '버티컬 인체공학 마우스', category: 'mouse', price: 59000 },
  m2: { name: '초경량 게이밍 마우스', category: 'mouse', price: 99000 },
}

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[]
export const PRODUCT_IDS = Object.keys(PRODUCTS) as ProductId[]

/** 계층형 태그: catalog(상위) > catalog:category:x(중간) > product:id(하위) */
export const TAGS = {
  catalog: `${PREFIX}:catalog`,
  category: (id: CategoryId) => `${PREFIX}:catalog:category:${id}`,
  product: (id: ProductId) => `${PREFIX}:product:${id}`,
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && (CATEGORY_IDS as string[]).includes(value)
}

export function isProductId(value: unknown): value is ProductId {
  return typeof value === 'string' && (PRODUCT_IDS as string[]).includes(value)
}
