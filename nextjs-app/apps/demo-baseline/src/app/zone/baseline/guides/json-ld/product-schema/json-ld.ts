import type { ProductJsonLd, ProductRecord } from './types'

export const LD_SELECTOR = 'script[type="application/ld+json"]'
export const PRODUCT_SCRIPT_ID = 'product-jsonld'

/** 서버 데이터 → Schema.org Product 객체 (화면과 같은 원본에서 만든다) */
export function buildProductJsonLd(product: ProductRecord): ProductJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    sku: product.sku,
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.priceCurrency,
      availability: `https://schema.org/${product.availability}`,
    },
  }
}

/** 공식 가이드 권장 방식: `<`를 유니코드 이스케이프 `<`로 치환 */
export function serializeJsonLdSafe(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

/** 치환 전(비교용). 이 함수의 결과는 실제 페이지에 렌더하지 않는다. */
export function serializeJsonLdUnsafe(value: unknown): string {
  return JSON.stringify(value)
}
