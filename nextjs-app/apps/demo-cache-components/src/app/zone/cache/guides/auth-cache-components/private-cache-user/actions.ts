'use server'

import type { PrivateUserCacheState } from './types'

export async function fetchPrivateUserCacheAction(userId: 'user_A' | 'user_B'): Promise<PrivateUserCacheState> {
  const time = new Date().toLocaleTimeString()

  if (userId === 'user_A') {
    return {
      userId: 'user_A',
      userName: '사용자 A (골드 회원)',
      cacheKey: 'private:session:user_A:cart',
      cartItems: [
        { id: 'item-1', name: '노이즈캔슬링 헤드폰', price: 289000, quantity: 1 },
        { id: 'item-2', name: 'USB-C 멀티 충전기', price: 35000, quantity: 2 },
      ],
      totalAmount: 359000,
      cachedAt: time,
    }
  }

  // user_B
  return {
    userId: 'user_B',
    userName: '사용자 B (실버 회원)',
    cacheKey: 'private:session:user_B:cart',
    cartItems: [
      { id: 'item-3', name: '기계식 키보드 청축', price: 129000, quantity: 1 },
    ],
    totalAmount: 129000,
    cachedAt: time,
  }
}
