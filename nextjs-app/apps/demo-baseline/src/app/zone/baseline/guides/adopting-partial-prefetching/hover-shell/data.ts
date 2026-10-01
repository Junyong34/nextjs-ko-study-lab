// 목록·상세 라우트가 공유하는 상품 데이터. 링크 prefetch prop 3종을 카드마다 하나씩 배정한다.

export const BASE = '/zone/baseline/guides/adopting-partial-prefetching/hover-shell'

/** 상세 페이지 동적 영역(LiveStock)이 서버에서 일부러 지연되는 시간 */
export const STOCK_DELAY_MS = 1500

export type LinkMode = 'auto' | 'true' | 'false'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  /** 이 카드의 <Link>에 전달하는 prefetch prop */
  linkMode: LinkMode
}

export const PRODUCTS: Product[] = [
  { id: '1', name: '러닝 재킷', description: '방풍 원단에 가벼운 보온성을 더한 경량 재킷입니다.', price: 89000, linkMode: 'auto' },
  { id: '2', name: '트레일 백팩', description: '20L 용량에 하네스 조절이 가능한 백팩입니다.', price: 129000, linkMode: 'true' },
  { id: '3', name: '캠핑 랜턴', description: '3단계 밝기 조절을 지원하는 충전식 랜턴입니다.', price: 45000, linkMode: 'false' },
]

export const productPath = (id: string) => `${BASE}/products/${id}`

export function findProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id)
}
