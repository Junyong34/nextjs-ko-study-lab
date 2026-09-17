export interface LegacyProduct {
  legacyId: string
  slug: 'running-shoes' | 'windbreaker'
  name: string
  price: number
}

/** 레거시(구형) 상품 ID → 신규 SEO 표준 슬러그 매핑. 실제 Route Handler와 검증 화면이 공유하는 단일 원본이다. */
export const LEGACY_PRODUCTS: LegacyProduct[] = [
  { legacyId: '1001', slug: 'running-shoes', name: '프리미엄 러닝화', price: 129000 },
  { legacyId: '1002', slug: 'windbreaker', name: '방수 윈드브레이커', price: 189000 },
]

export const PRODUCTS_BY_SLUG: Record<string, { name: string; price: number }> = Object.fromEntries(
  LEGACY_PRODUCTS.map((product) => [product.slug, { name: product.name, price: product.price }]),
)

export type ProbeKind = 'permanent' | 'temporary'

export interface ProbeResult {
  status: number
  statusText: string
  location: string | null
}
