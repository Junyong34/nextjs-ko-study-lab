import { siteUrl } from '@study/demos'

/**
 * 데모용 상품 카탈로그. 외부 DB 대신 이 모듈이 결정적(deterministic)으로 상품을 만든다.
 * 실제 서비스라면 generateSitemaps()에서 COUNT(*)를, sitemap({ id })에서 페이지 단위 SELECT를 한다.
 */
export const TOTAL_PRODUCTS = 3500

/** 검색엔진(Google) 기준 sitemap 1개 파일의 URL 상한 */
export const SEARCH_ENGINE_URL_LIMIT = 50_000

/**
 * 데모 규모에 맞춘 파일당 URL 수. 실서비스에서는 SEARCH_ENGINE_URL_LIMIT(50,000)를 그대로 쓰면 된다.
 * 3,500건 / 1,000건 = 4개 파일(마지막 파일은 500건)로 나뉜다.
 */
export const URLS_PER_SITEMAP = 1000

const CATALOG_EPOCH = Date.UTC(2026, 0, 1)

export const DEMO_PATH = '/zone/baseline/file-conventions/metadata-sitemap/split-index-sitemaps'

/** 상품 상세 URL의 절대 경로. 도메인은 앱 layout의 metadataBase와 같은 siteUrl을 쓴다. */
export function productUrl(index: number): string {
  const sku = `SKU-${String(index + 1).padStart(6, '0')}`
  return `${siteUrl}/products/${sku}`
}

/** [start, end) 구간의 상품을 만든다. 실서비스의 LIMIT/OFFSET 쿼리 자리다. */
export function getProducts(start: number, end: number) {
  const last = Math.min(end, TOTAL_PRODUCTS)
  const products: { url: string; lastModified: Date }[] = []
  for (let i = start; i < last; i++) {
    // 상품마다 다른 수정일(2026-01-01 00:00 UTC부터 i시간 뒤)을 결정적으로 부여한다.
    products.push({ url: productUrl(i), lastModified: new Date(CATALOG_EPOCH + i * 3_600_000) })
  }
  return products
}

/** generateSitemaps()와 page.tsx가 같은 계산을 공유한다: ceil(3500 / 1000) = 4 */
export function getSitemapCount(): number {
  return Math.ceil(TOTAL_PRODUCTS / URLS_PER_SITEMAP)
}
