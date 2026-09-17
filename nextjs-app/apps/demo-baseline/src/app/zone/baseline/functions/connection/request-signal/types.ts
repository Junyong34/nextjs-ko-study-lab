import { MOCK_PRODUCTS } from '@study/demo-kit'

export type ProbeMode = 'static' | 'dynamic'

/**
 * 재고 확인 데모가 공유하는 상품 mock 데이터. 카탈로그 기준 재고(stock)가 8개뿐인
 * 재고 소진 임박 상품이라 "왜 실시간 재고 확인이 필요한가"라는 서사와 맞물린다.
 */
export const DEMO_PRODUCT = MOCK_PRODUCTS.find((product) => product.id === 'prod-002')!

/**
 * 렌더링마다 다시 계산되는 "판매 진행 중" 실시간 재고. 카탈로그 재고(8개)를 상한으로 삼아
 * 무작위로 줄어든 값을 낸다 — 이 무작위성 자체가 공식 문서의 Math.random() 예제와 같은
 * "요청마다 달라져야 하는 값"이다.
 */
export function rollLiveStock(): number {
  return Math.max(0, DEMO_PRODUCT.stock - Math.floor(Math.random() * 4))
}
