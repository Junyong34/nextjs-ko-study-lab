export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface CartSummary {
  items: CartItem[]
  totalPrice: number
  totalQuantity: number
  updatedAt: string
}
