/** 상품 DB 레코드 — 판매자가 입력한 description은 신뢰할 수 없는 문자열이다. */
export interface ProductRecord {
  sku: string
  name: string
  brand: string
  description: string
  image: string
  price: number
  priceCurrency: 'KRW'
  availability: 'InStock' | 'OutOfStock'
}

/** Schema.org Product + Offer (schema-dts 없이 필요한 필드만 직접 선언) */
export interface ProductJsonLd {
  '@context': 'https://schema.org'
  '@type': 'Product'
  sku: string
  name: string
  brand: { '@type': 'Brand'; name: string }
  description: string
  image: string
  offers: {
    '@type': 'Offer'
    price: number
    priceCurrency: string
    availability: string
  }
}

export interface FieldRow {
  path: string
  expected: string
  actual: string
  ok: boolean
}

/** 페이지 HTML 원문(하이드레이션 전)을 다시 받아 측정한 값 */
export interface SsrProbe {
  requestedPath: string
  status: number
  contentType: string | null
  htmlBytes: number
  ldScriptCount: number
  found: boolean
  parentTag: string | null
  inBody: boolean
  offset: number
  rawText: string
  rawLtCount: number
  escapedLtCount: number
  matchesSafeSerializer: boolean
  parseError: string | null
  fields: FieldRow[]
  liveDomCount: number
  fetchedAt: string
}

/** 격리된 DOMParser 문서에서 한 가지 직렬화 결과를 파싱한 측정값 */
export interface ParseContrast {
  label: string
  serialized: string
  scriptCount: number
  scriptText: string
  jsonOk: boolean
  jsonError: string | null
  injectedCount: number
  leakedText: string
  descriptionRoundTrip: boolean
}
