import type { Product } from '@study/demo-kit'

/** 검색어가 비어 있으면 전체 통과, 아니면 상품명/태그에 대소문자 무시 부분일치 검색 */
export function matchesQuery(product: Product, query: string): boolean {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return true

  if (product.name.toLowerCase().includes(trimmed)) return true
  return product.tags.some((tag) => tag.toLowerCase().includes(trimmed))
}
