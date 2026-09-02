export interface ProductReview {
  id: string
  author: string
  rating: number
  comment: string
  createdAt: string
}

export interface RecommendationItem {
  id: string
  title: string
  price: number
  matchRate: string
}
