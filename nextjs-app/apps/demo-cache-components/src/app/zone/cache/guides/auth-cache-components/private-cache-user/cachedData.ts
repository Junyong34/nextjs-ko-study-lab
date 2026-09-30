import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'
import { bumpRun } from './runCounter'
import { CART_USER_IDS, USER_COOKIE_NAME, type CartUserId, type CartUserOrGuest, type PrivateCartResult, type UserCartItem } from './types'

const CARTS: Record<CartUserId, UserCartItem[]> = {
  user_A: [
    { id: 'item-1', name: '노이즈캔슬링 헤드폰', price: 289000, quantity: 1 },
    { id: 'item-2', name: 'USB-C 멀티 충전기', price: 35000, quantity: 2 },
  ],
  user_B: [{ id: 'item-3', name: '기계식 키보드 청축', price: 129000, quantity: 1 }],
}

function resolveUser(raw: string | undefined): CartUserOrGuest {
  return (CART_USER_IDS as string[]).includes(raw ?? '') ? (raw as CartUserId) : 'guest'
}

/**
 * 'use cache: private' 스코프 안에서 cookies()를 직접 읽는다 (일반 'use cache'에서는 금지).
 * userId를 인자로 받지 않는다 — 어떤 사용자의 캐시인지는 스코프 안에서 읽은 쿠키가 정한다.
 * 결과는 서버에 저장되지 않고 요청한 브라우저 메모리에만 캐시된다.
 */
export async function getPrivateCart(): Promise<PrivateCartResult> {
  'use cache: private'
  cacheLife({ stale: 60 })

  const userId = resolveUser((await cookies()).get(USER_COOKIE_NAME)?.value)
  cacheTag(`guides-auth-cache-components-private-cache-user:${userId}`)

  const cartItems = userId === 'guest' ? [] : CARTS[userId]
  return {
    userId,
    cartItems,
    totalAmount: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString('ko-KR'),
    bodyRuns: bumpRun(userId),
  }
}
