import { toRankingCategory } from '../types'
import { CachedRankingPanel } from './CachedRankingPanel'
import { RequestTimeSlot } from './RequestTimeSlot'
import { CategoryControls } from './CategoryControls'

/**
 * searchParams(런타임 값)는 캐시 스코프 밖에서 읽고, 직렬화 가능한 문자열 prop으로만 넘긴다.
 * 'use cache' 컴포넌트 안에서 searchParams를 직접 읽으면 next-request-in-use-cache 오류가 난다.
 */
export async function CategoryStage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const category = toRankingCategory((await searchParams).category)

  return (
    <div className="space-y-3">
      <CategoryControls current={category} />
      <CachedRankingPanel category={category}>
        <RequestTimeSlot category={category} />
      </CachedRankingPanel>
    </div>
  )
}
