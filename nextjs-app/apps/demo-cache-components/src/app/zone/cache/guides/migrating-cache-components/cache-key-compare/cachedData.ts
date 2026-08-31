import { cacheTag } from 'next/cache'
import { MOCK_PRODUCTS } from '@study/demo-kit'

export type Currency = 'KRW' | 'USD'
export type Tier = 'NORMAL' | 'VIP' | 'VVIP'

// Next.js 16 'use cache'는 이 함수의 세 인자(sku, currency, tier) 조합마다
// 자동으로 별도의 캐시 항목을 만든다 — 수동으로 키 문자열을 조합할 필요가 없다.
export async function getProductPrice(sku: string, currency: Currency, tier: Tier) {
  'use cache'
  cacheTag(`product-price:${sku}`)

  const product = MOCK_PRODUCTS.find((p) => p.id === sku) || MOCK_PRODUCTS[0]
  const discountRate = tier === 'VVIP' ? 0.25 : tier === 'VIP' ? 0.15 : 0
  const discountedKrw = Math.round(product.price * (1 - discountRate))
  const exchangeRate = 1350
  const finalPrice = currency === 'KRW' ? `${discountedKrw.toLocaleString()}원` : `$${(discountedKrw / exchangeRate).toFixed(2)}`

  return {
    productName: product.name,
    finalPrice,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}
