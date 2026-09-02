'use server'

import type { ProductReview, RecommendationItem } from './types'

/**
 * Server Action 1: 1.2초 지연되는 구매 후기 데이터 Promise
 */
export async function fetchReviewsPromise(delayMs: number = 1200): Promise<ProductReview[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs))

  return [
    {
      id: 'rev-1',
      author: '개발자K',
      rating: 5,
      comment: '타건음이 조약돌 굴러가는 소리처럼 정말 도각도각 좋습니다! 대만족.',
      createdAt: '2026-08-20',
    },
    {
      id: 'rev-2',
      author: '키보드매니아',
      rating: 5,
      comment: '풀 알루미늄이라 묵직해서 흔들림 없이 안정적으로 코딩할 수 있네요.',
      createdAt: '2026-08-19',
    },
    {
      id: 'rev-3',
      author: '디자이너P',
      rating: 4,
      comment: '마감 퀄리티가 훌륭합니다. 블루투스 멀티페어링도 빠르고 매끄러워요.',
      createdAt: '2026-08-18',
    },
  ]
}

/**
 * Server Action 2: 2.5초 지연되는 AI 맞춤 추천 상품 데이터 Promise
 */
export async function fetchRecommendationsPromise(delayMs: number = 2500): Promise<RecommendationItem[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs))

  return [
    { id: 'rec-1', title: 'PBT 이중사출 체리프로파일 키캡 세트', price: 45000, matchRate: '98% 일치' },
    { id: 'rec-2', title: '고탄성 팜레스트 손목 받침대', price: 28000, matchRate: '94% 일치' },
    { id: 'rec-3', title: '프리미엄 코일형 C타입 항공 케이블', price: 23000, matchRate: '89% 일치' },
  ]
}
