import { MOCK_PRODUCTS, type Product } from '@study/demo-kit'

export const BASE = '/zone/baseline/file-conventions/layout/dynamic-category-layout'

export const CATEGORIES = [
  { slug: 'electronics', label: '전자기기' },
  { slug: 'fashion', label: '패션' },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]['slug']

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value)
}

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
}

export function getProducts(category: CategorySlug): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.category === category)
}

export function getProduct(category: CategorySlug, item: string): Product | undefined {
  return getProducts(category).find((p) => p.id === item)
}

/** 현재 경로에서 [category] 세그먼트 값을 읽는다. 루트 경로면 null. */
export function categoryFromPathname(pathname: string): string | null {
  if (!pathname.startsWith(`${BASE}/`)) return null
  return pathname.slice(BASE.length + 1).split('/')[0] || null
}
