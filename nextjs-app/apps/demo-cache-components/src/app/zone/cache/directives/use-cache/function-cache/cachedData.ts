import { MOCK_PRODUCTS } from '@study/demo-kit'

export interface PopularRankingEntry {
  rank: number
  id: string
  name: string
  rating: number
  reviewCount: number
}

export interface PopularRankingResult {
  ranking: PopularRankingEntry[]
  cacheId: string
  generatedAt: string
}

// 'use cache'만 선언하고 cacheTag/cacheLife는 붙이지 않는다 — 기본(default) 프로파일 그대로의
// 함수 단위 캐싱만 시연하기 위함이다 (stale 5분/client, revalidate 15분/server, expire 없음).
export async function getPopularProductRanking(): Promise<PopularRankingResult> {
  'use cache'

  const ranking = [...MOCK_PRODUCTS]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4)
    .map((product, index) => ({
      rank: index + 1,
      id: product.id,
      name: product.name,
      rating: product.rating,
      reviewCount: product.reviewCount,
    }))

  return {
    ranking,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    }),
  }
}
