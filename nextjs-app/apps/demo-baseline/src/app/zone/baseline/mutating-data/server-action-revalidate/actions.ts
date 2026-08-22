'use server'

import { revalidatePath } from 'next/cache'
import type { CartItem, CartSummary } from './types'

const PAGE_PATH = '/zone/baseline/mutating-data/server-action-revalidate'

// 서버 메모리 장바구니 저장소
let globalCart: CartItem[] = [
  { id: 'cart-1', name: '에어 줌 프로 러닝화', price: 159000, quantity: 1 },
  { id: 'cart-2', name: '오버핏 기모 맨투맨', price: 49000, quantity: 2 },
  { id: 'cart-3', name: '알루미늄 모니터 암 싱글', price: 54000, quantity: 1 },
]

function calculateSummary(): CartSummary {
  const totalPrice = globalCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalQuantity = globalCart.reduce((sum, item) => sum + item.quantity, 0)
  const updatedAt = new Date().toLocaleTimeString('ko-KR')
  return {
    items: [...globalCart],
    totalPrice,
    totalQuantity,
    updatedAt,
  }
}

export async function getCartSummary(): Promise<CartSummary> {
  return calculateSummary()
}

/**
 * Server Action: 장바구니 수량 변경 및 revalidatePath 호출
 */
export async function updateCartQuantity(
  itemId: string,
  delta: number,
): Promise<CartSummary> {
  globalCart = globalCart
    .map((item) => {
      if (item.id === itemId) {
        const nextQty = Math.max(0, item.quantity + delta)
        return { ...item, quantity: nextQty }
      }
      return item
    })
    .filter((item) => item.quantity > 0)

  // Next.js 캐시 무효화 및 서버 컴포넌트 자동 재렌더링 트리거
  revalidatePath(PAGE_PATH)

  return calculateSummary()
}

export async function resetCart(): Promise<CartSummary> {
  globalCart = [
    { id: 'cart-1', name: '에어 줌 프로 러닝화', price: 159000, quantity: 1 },
    { id: 'cart-2', name: '오버핏 기모 맨투맨', price: 49000, quantity: 2 },
    { id: 'cart-3', name: '알루미늄 모니터 암 싱글', price: 54000, quantity: 1 },
  ]
  revalidatePath(PAGE_PATH)
  return calculateSummary()
}
