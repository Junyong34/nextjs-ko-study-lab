import { MOCK_PRODUCTS, type Product } from '@study/demo-kit'

/** 이 데모의 실제 기본 라우트 경로. 서브 라우트는 모두 이 경로 아래 실제 다이나믹 세그먼트 디렉토리([category]/[id])로 존재한다. */
export const BASE_PATH = '/zone/baseline/functions/use-params/client-id'

export interface ProductLink {
  product: Product
  href: string
  label: string
}

function requireProduct(id: string): Product {
  const product = MOCK_PRODUCTS.find((item) => item.id === id)
  if (!product) {
    throw new Error(`mock product not found: ${id}`)
  }
  return product
}

const KEYBOARD = requireProduct('prod-001')
const HOODIE = requireProduct('prod-004')

/**
 * 실제 [category]/[id] 다이나믹 세그먼트로 이동하는 상품 링크 목록.
 * 서로 다른 category 값을 가진 두 상품을 오가며 useParams()가 반환하는
 * category/id 값이 클릭할 때마다 실제로 바뀌는지 관찰한다.
 */
export const PRODUCT_LINKS: ProductLink[] = [KEYBOARD, HOODIE].map((product) => ({
  product,
  href: `${BASE_PATH}/${product.category}/${product.id}`,
  label: `${product.categoryName} · ${product.name}`,
}))

/**
 * mock 데이터에 없는 id로 이동하는 케이스.
 * useParams()는 URL 세그먼트 문자열을 그대로 반환할 뿐 값의 유효성을 검증하지 않으므로,
 * 일치하는 상품이 없을 때 애플리케이션이 직접 방어해야 함을 보여준다.
 */
export const INVALID_LINK = {
  href: `${BASE_PATH}/electronics/does-not-exist`,
  label: '전자기기 · 존재하지 않는 ID',
}
