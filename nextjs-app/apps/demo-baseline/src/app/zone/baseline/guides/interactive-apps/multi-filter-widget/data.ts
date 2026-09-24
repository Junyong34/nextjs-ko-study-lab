import { MOCK_PRODUCTS, type Product } from '@study/demo-kit'
import type { CategoryOption, Filters } from './types'

/**
 * 서버 전용 데이터 계층. page.tsx(Server Component)에서만 호출한다.
 * 상품 원본은 서버에만 있고, 클라이언트는 서버가 필터링·정렬한 결과만 받는다.
 */

/** 대기 피드백(data-pending)을 눈으로 볼 수 있게 서버 읽기에 주입하는 지연. 결과값에는 영향이 없다. */
export const SERVER_LATENCY_MS = 400

export function listCategories(): CategoryOption[] {
  const map = new Map<string, string>()
  for (const p of MOCK_PRODUCTS) map.set(p.category, p.categoryName)
  return [...map].map(([value, label]) => ({ value, label }))
}

export async function queryProducts(filters: Filters): Promise<{ products: Product[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, SERVER_LATENCY_MS))

  let products = MOCK_PRODUCTS.filter(
    (p) =>
      (filters.categories.length === 0 || filters.categories.includes(p.category)) &&
      (!filters.inStock || p.stock > 0),
  )

  if (filters.sort === 'price_asc') products = [...products].sort((a, b) => a.price - b.price)
  if (filters.sort === 'price_desc') products = [...products].sort((a, b) => b.price - a.price)
  if (filters.sort === 'rating') products = [...products].sort((a, b) => b.rating - a.rating)

  return { products, total: MOCK_PRODUCTS.length }
}

/** 서버 렌더마다 새 식별자와 시각을 찍는다. */
export function createRenderStamp() {
  return { renderId: crypto.randomUUID().slice(0, 8), renderedAt: new Date().toISOString() }
}
