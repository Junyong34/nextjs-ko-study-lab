import { CATEGORIES, DEFAULT_CATEGORY } from './types'
import type { CategoryId } from './types'

export interface Product {
  id: string
  name: string
  price: number
}

const ITEMS_PER_CATEGORY = 24

/** 카테고리마다 같은 개수의 상품 — 목록 높이가 같아야 scrollY/scrollTop이 잘리지(clamp) 않는다. */
export function productsOf(category: CategoryId): Product[] {
  const idx = CATEGORIES.findIndex((c) => c.id === category)
  const label = CATEGORIES[idx].label
  return Array.from({ length: ITEMS_PER_CATEGORY }, (_, i) => ({
    id: `${category}-${i + 1}`,
    name: `${label} ${String(i + 1).padStart(2, '0')}`,
    price: 19000 + ((idx * 7 + i * 13) % 20) * 4000,
  }))
}

export function parseCategory(value: string | string[] | undefined): CategoryId {
  const v = Array.isArray(value) ? value[0] : value
  return CATEGORIES.some((c) => c.id === v) ? (v as CategoryId) : DEFAULT_CATEGORY
}

export function labelOf(category: CategoryId) {
  return CATEGORIES.find((c) => c.id === category)?.label ?? category
}

export function nextCategory(category: string | null): CategoryId {
  const idx = CATEGORIES.findIndex((c) => c.id === category)
  return CATEGORIES[(idx + 1) % CATEGORIES.length].id
}
