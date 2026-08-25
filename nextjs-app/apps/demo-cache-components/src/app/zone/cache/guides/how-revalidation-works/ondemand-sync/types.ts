export interface ProductSummary {
  id: string
  name: string
  price: number
  stock: number
  tag: string
  cachedAt: string
}

export interface TagPurgeResult {
  tag: string
  status: 'FRESH' | 'PURGED_AND_REGENERATED'
  products: ProductSummary[]
  purgedAt: string
  purgeCount: number
}
