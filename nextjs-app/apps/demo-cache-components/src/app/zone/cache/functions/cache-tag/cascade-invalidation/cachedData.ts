import { cacheTag } from 'next/cache'
import { CATEGORIES, CATEGORY_IDS, PRODUCTS, PRODUCT_IDS, TAGS } from './tags'
import type { CacheEntrySnapshot, CategoryId, ProductId } from './types'

/** 캐시 함수 본문이 실행된 순간에만 만들어지는 생성 기록 */
function stamp() {
  return {
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toISOString().slice(11, 23),
  }
}

/** 상위 엔트리: 카탈로그 요약 — 상위 태그 1개만 부착 */
export async function getCatalogSummary(): Promise<CacheEntrySnapshot> {
  'use cache'
  const tags = [TAGS.catalog]
  cacheTag(...tags)

  return {
    key: 'catalog',
    level: 'catalog',
    label: '카탈로그 요약',
    detail: `카테고리 ${CATEGORY_IDS.length}개 · 상품 ${PRODUCT_IDS.length}개`,
    tags,
    ...stamp(),
  }
}

/** 중간 엔트리: 카테고리 목록 — 상위 + 카테고리 태그 부착 */
export async function getCategoryListing(id: CategoryId): Promise<CacheEntrySnapshot> {
  'use cache'
  const tags = [TAGS.catalog, TAGS.category(id)]
  cacheTag(...tags)

  const category = CATEGORIES[id]
  return {
    key: `category:${id}`,
    level: 'category',
    label: `${category.name} 목록`,
    detail: category.products.map((p) => PRODUCTS[p].name).join(', '),
    tags,
    ...stamp(),
  }
}

/** 하위 엔트리: 상품 상세 — 상위 + 카테고리 + 상품 태그 부착 */
export async function getProductDetail(id: ProductId): Promise<CacheEntrySnapshot> {
  'use cache'
  const product = PRODUCTS[id]
  const tags = [TAGS.catalog, TAGS.category(product.category), TAGS.product(id)]
  cacheTag(...tags)

  return {
    key: `product:${id}`,
    level: 'product',
    label: product.name,
    detail: `${product.price.toLocaleString('ko-KR')}원`,
    tags,
    ...stamp(),
  }
}

/** 페이지가 그리는 캐시 엔트리 7개를 모두 읽는다 (각각 독립된 'use cache' 엔트리) */
export async function getAllEntries(): Promise<CacheEntrySnapshot[]> {
  return Promise.all([
    getCatalogSummary(),
    ...CATEGORY_IDS.map((id) => getCategoryListing(id)),
    ...PRODUCT_IDS.map((id) => getProductDetail(id)),
  ])
}
