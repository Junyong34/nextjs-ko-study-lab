import type { Product, Review } from '../types'

/** 데모 세션의 로그인 사용자. Server Action이 리뷰 작성자 여부를 이 값과 비교한다. */
export const DEMO_VIEWER_ID = 'user-kim'

const PRODUCTS: Record<string, Product> = {
  'P-100': { id: 'P-100', name: '프리미엄 러닝화', price: 129000, visibility: 'public', status: 'published' },
  'P-200': { id: 'P-200', name: '사내 품질검수용 샘플', price: 0, visibility: 'private', status: 'published' },
  'P-300': { id: 'P-300', name: '출시 예정 윈드브레이커', price: 189000, visibility: 'public', status: 'draft' },
}

const REVIEWS: Record<string, Review> = {
  'R-1': { id: 'R-1', productId: 'P-100', authorId: DEMO_VIEWER_ID, body: '쿠션이 좋아요. 사이즈는 정사이즈.' },
  'R-2': { id: 'R-2', productId: 'P-100', authorId: 'user-park', body: '발볼이 넓으면 반 치수 크게 추천.' },
}

export function findProduct(id: string): Product | undefined {
  return PRODUCTS[id]
}

export function findReview(productId: string, reviewId: string): Review | undefined {
  const review = REVIEWS[reviewId]
  return review && review.productId === productId ? review : undefined
}

export function listReviews(productId: string): Review[] {
  return Object.values(REVIEWS).filter((r) => r.productId === productId)
}
