import type { Product, ProductPage } from '../types'

const CATEGORIES = ['오디오', '키보드', '모니터', '주변기기', '수납']
const NAMES = ['무선 헤드폰', '기계식 키보드', '27인치 모니터', '모니터 암', '데스크 매트', 'USB-C 허브']

/** 결정적인 상품 30개. 커서는 상품 id다. */
export const PRODUCTS: Product[] = Array.from({ length: 30 }, (_, i) => ({
  id: `p${String(i + 1).padStart(3, '0')}`,
  name: `${NAMES[i % NAMES.length]} ${Math.floor(i / NAMES.length) + 1}세대`,
  category: CATEGORIES[i % CATEGORIES.length],
  price: 19000 + ((i * 7919) % 23) * 4000,
}))

// 요청 카운터는 데모 접두사 키로 globalThis에 둔다(dev 모듈 재평가에도 유지).
const STORE_KEY = '__guidesTanstackInfiniteScrollStore'

interface Store {
  requestNo: number
  hits: Record<string, number>
}

function store(): Store {
  const g = globalThis as typeof globalThis & { [STORE_KEY]?: Store }
  g[STORE_KEY] ??= { requestNo: 0, hits: {} }
  return g[STORE_KEY]
}

export function resetCatalog() {
  const g = globalThis as typeof globalThis & { [STORE_KEY]?: Store }
  g[STORE_KEY] = { requestNo: 0, hits: {} }
}

/** 커서 다음 상품부터 limit개. 요청 수와 커서별 수신 횟수를 함께 센다. */
export function readPage(cursor: string | null, limit: number): ProductPage {
  const s = store()
  s.requestNo += 1
  const hitKey = cursor ?? 'start'
  s.hits[hitKey] = (s.hits[hitKey] ?? 0) + 1

  const start = cursor ? PRODUCTS.findIndex((p) => p.id === cursor) + 1 : 0
  const items = PRODUCTS.slice(start, start + limit)
  const end = start + items.length
  return {
    items,
    nextCursor: end < PRODUCTS.length && items.length > 0 ? items[items.length - 1].id : null,
    pageNo: Math.floor(start / limit) + 1,
    total: PRODUCTS.length,
    requestNo: s.requestNo,
    cursorHits: s.hits[hitKey],
  }
}
