import { unstable_cache, cacheLife, cacheTag } from 'next/cache'
import { MOCK_PRODUCTS } from '@study/demo-kit'

const PRODUCT_ID = 'prod-001'

function generateSnapshot() {
  const product = MOCK_PRODUCTS.find((p) => p.id === PRODUCT_ID) || MOCK_PRODUCTS[0]
  return {
    productName: product.name,
    price: product.price,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    }),
  }
}

// 레거시: unstable_cache — 키 배열과 태그를 수동으로 전달해야 한다.
export const getLegacyCachedProduct = unstable_cache(
  async () => generateSnapshot(),
  ['guides-migrating-cache-components-unstable-to-use-cache:legacy-product'],
  { tags: ['guides-migrating-cache-components-unstable-to-use-cache:legacy-product'], revalidate: false }
)

// 모던: 'use cache' + cacheTag — 캐시 경계와 태그가 함수 스코프에 선언적으로 드러난다.
export async function getModernCachedProduct() {
  'use cache'
  cacheTag('guides-migrating-cache-components-unstable-to-use-cache:modern-product')
  cacheLife('minutes')

  return generateSnapshot()
}
