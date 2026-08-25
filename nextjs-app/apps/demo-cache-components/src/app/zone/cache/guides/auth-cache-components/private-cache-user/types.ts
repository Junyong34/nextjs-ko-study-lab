export interface UserCartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface PrivateUserCacheState {
  userId: 'user_A' | 'user_B'
  userName: string
  cacheKey: string
  cartItems: UserCartItem[]
  totalAmount: number
  cachedAt: string
}
