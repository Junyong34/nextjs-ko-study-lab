export interface CategoryProduct {
  id: string
  name: string
  price: number
  category: string
  stock: number
}

export interface ServerFilterResult {
  category: string
  products: CategoryProduct[]
  serverLatencyMs: number
  serverTimestamp: string
}
