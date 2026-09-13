import type { Product } from '@study/demo-kit'

export interface OrderResult {
  orderNo: string
  productId: string
  productName: string
  price: number
  processedAt: string
}

/**
 * page.tsx(Server Component)의 함수 본문 내부에서 상품별로 인라인 선언되는
 * 'use server' 클로저 액션. 인자를 받지 않아도 productId/price가 정상 동작하는 것이
 * 상위 스코프 변수가 클로저로 캡처되어 서버에 직렬화 전달됐다는 증거가 된다.
 */
export type BuyProductAction = () => Promise<OrderResult>

export interface ProductBuyItem {
  product: Product
  buyAction: BuyProductAction
}
