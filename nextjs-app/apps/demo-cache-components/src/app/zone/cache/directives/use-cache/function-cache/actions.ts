'use server'

import { getPopularProductRanking, type PopularRankingResult } from './cachedData'

// 클라이언트 버튼 클릭마다 같은 'use cache' 함수를 다시 호출하는 Server Action.
// 함수 본문이 재실행되지 않는 한(=캐시 HIT) 매번 같은 cacheId/generatedAt이 돌아온다.
export async function refetchPopularRankingAction(): Promise<PopularRankingResult> {
  return getPopularProductRanking()
}
