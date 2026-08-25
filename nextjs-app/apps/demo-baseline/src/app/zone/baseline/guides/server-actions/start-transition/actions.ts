'use server'

import type { CategoryProduct, ServerFilterResult } from './types'

const ALL_PRODUCTS: CategoryProduct[] = [
  { id: 'p-1', name: '4K OLED 모니터 32인치', price: 890000, category: '전자기기', stock: 12 },
  { id: 'p-2', name: '인체공학 기계식 키보드', price: 185000, category: '전자기기', stock: 28 },
  { id: 'p-3', name: '프리미엄 메리노울 니트', price: 98000, category: '의류', stock: 45 },
  { id: 'p-4', name: '방수 기능성 윈드브레이커', price: 139000, category: '의류', stock: 19 },
  { id: 'p-5', name: 'Next.js 15 완벽 가이드북', price: 42000, category: '도서', stock: 77 },
  { id: 'p-6', name: '리팩터링 2판 (한글판)', price: 38000, category: '도서', stock: 34 },
]

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function filterCategoryProductsAction(category: string): Promise<ServerFilterResult> {
  const start = Date.now()
  // 의도적인 600ms 서버 네트워크/DB 지연
  await sleep(600)

  const filtered = category === '전체'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter((p) => p.category === category)

  return {
    category,
    products: filtered,
    serverLatencyMs: Date.now() - start,
    serverTimestamp: new Date().toLocaleTimeString(),
  }
}
