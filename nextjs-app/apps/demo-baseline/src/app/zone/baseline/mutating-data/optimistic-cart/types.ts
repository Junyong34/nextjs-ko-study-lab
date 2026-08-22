export interface OptimisticCartItem {
  id: string
  name: string
  price: number
  quantity: number
  isOptimistic?: boolean
}

export interface OptimisticState {
  items: OptimisticCartItem[]
  totalCount: number
  totalPrice: number
  status: 'idle' | 'optimistic_pending' | 'server_confirmed'
  lastActionTime: string
}
