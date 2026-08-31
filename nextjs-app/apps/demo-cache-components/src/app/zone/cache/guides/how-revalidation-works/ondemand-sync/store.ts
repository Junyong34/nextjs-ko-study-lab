export interface StoredProduct {
  id: string
  name: string
  price: number
  stock: number
}

export const productStore: StoredProduct[] = [
  { id: 'p-101', name: '스마트 에어프라이어 5L', price: 89000, stock: 15 },
  { id: 'p-102', name: '초고속 무선 충전기 3in1', price: 45000, stock: 42 },
]
