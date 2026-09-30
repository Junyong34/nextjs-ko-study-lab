export type CartUserId = 'user_A' | 'user_B'

export const USER_COOKIE_NAME = 'private-cache-user-uid'

export const CART_USER_IDS: CartUserId[] = ['user_A', 'user_B']

export const USER_LABELS: Record<CartUserId, string> = {
  user_A: '사용자 A (골드 회원)',
  user_B: '사용자 B (실버 회원)',
}

export interface UserCartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export type CartUserOrGuest = CartUserId | 'guest'

export interface PrivateCartResult {
  userId: CartUserOrGuest
  cartItems: UserCartItem[]
  totalAmount: number
  cacheId: string
  generatedAt: string
  // 이 사용자 키로 함수 본문이 서버에서 실행된 누적 횟수 (= 캐시 miss 횟수)
  bodyRuns: number
}
