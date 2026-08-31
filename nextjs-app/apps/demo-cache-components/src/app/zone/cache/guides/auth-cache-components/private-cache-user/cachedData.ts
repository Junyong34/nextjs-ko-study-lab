import { cacheTag } from 'next/cache'

const CARTS = {
  user_A: {
    userName: '사용자 A (골드 회원)',
    cartItems: [
      { id: 'item-1', name: '노이즈캔슬링 헤드폰', price: 289000, quantity: 1 },
      { id: 'item-2', name: 'USB-C 멀티 충전기', price: 35000, quantity: 2 },
    ],
  },
  user_B: {
    userName: '사용자 B (실버 회원)',
    cartItems: [{ id: 'item-3', name: '기계식 키보드 청축', price: 129000, quantity: 1 }],
  },
} as const

export type UserId = keyof typeof CARTS

export async function getUserCartCache(userId: UserId) {
  'use cache'
  // 인자(userId)별로 Next.js가 자동으로 별도 캐시 항목을 생성한다 — 수동 키 조합이 필요 없다.
  cacheTag(`private-cart:${userId}`)

  const cart = CARTS[userId]
  const totalAmount = cart.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return {
    userId,
    userName: cart.userName,
    cartItems: cart.cartItems,
    totalAmount,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}
