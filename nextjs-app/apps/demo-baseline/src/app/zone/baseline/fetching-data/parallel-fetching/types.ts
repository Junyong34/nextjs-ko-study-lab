export interface ProductInfo {
  id: string
  title: string
  price: number
  category: string
  fetchDurationMs: number
}

export interface RecommendationItem {
  id: string
  name: string
  reason: string
  fetchDurationMs: number
}

export interface FetchResult {
  mode: 'sequential' | 'parallel'
  totalDurationMs: number
  product: ProductInfo
  recommendations: RecommendationItem[]
}
