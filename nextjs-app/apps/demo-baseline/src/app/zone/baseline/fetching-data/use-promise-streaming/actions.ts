'use server'

import type { ProductReview } from './types'

/**
 * Server Action:
 * 의도적 지연(delayMs)을 가진 구매 후기 데이터 Promise를 반환합니다.
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
