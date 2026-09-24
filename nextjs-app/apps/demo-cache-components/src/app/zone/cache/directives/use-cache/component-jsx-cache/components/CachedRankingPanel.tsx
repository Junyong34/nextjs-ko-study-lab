import type { ReactNode } from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { formatServerTime, RANKING_CATEGORIES, type RankingCategory } from '../types'
import { CachedRenderReporter } from './ObservationContext'

// 서버 프로세스 메모리에 남는 실제 실행 카운터.
// 'use cache' 컴포넌트 본문이 "실제로 실행될 때만" 증가한다 (캐시 HIT이면 증가하지 않는다).
let globalExecCount = 0
const execCountByCategory = new Map<RankingCategory, number>()

interface CachedRankingPanelProps {
  /** 직렬화 가능한 prop → 캐시 키에 포함된다 */
  category: RankingCategory
  /** pass-through 슬롯 → 캐시 키에 포함되지 않고, 캐시된 JSX 안에 구멍(hole)으로 남는다 */
  children: ReactNode
}

export async function CachedRankingPanel({ category, children }: CachedRankingPanelProps) {
  'use cache'

  globalExecCount += 1
  const categoryExecNo = (execCountByCategory.get(category) ?? 0) + 1
  execCountByCategory.set(category, categoryExecNo)

  const renderInfo = {
    category,
    renderId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    renderedAt: formatServerTime(new Date()),
    globalExecNo: globalExecCount,
    categoryExecNo,
  }

  const list = category === 'all' ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.category === category)
  const ranked = [...list].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, 3)
  const label = RANKING_CATEGORIES.find((c) => c.id === category)?.label ?? category

  return (
    <section className="space-y-3 rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 dark:border-indigo-900/70 dark:bg-indigo-950/20">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-indigo-100 pb-2 dark:border-indigo-900/50">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label} 베스트셀러 TOP 3</h3>
        <code className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300">
          {'<CachedRankingPanel category="'}
          {category}
          {'">'}
        </code>
      </header>

      <dl className="grid grid-cols-2 gap-2 font-mono text-[11px] sm:grid-cols-4">
        <div>
          <dt className="text-zinc-500">본문 렌더 시각</dt>
          <dd data-testid="cached-rendered-at" className="font-bold text-indigo-700 dark:text-indigo-300">{renderInfo.renderedAt}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">렌더 ID</dt>
          <dd data-testid="cached-render-id" className="font-bold text-indigo-700 dark:text-indigo-300">#{renderInfo.renderId}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">서버 전체 실행 순번</dt>
          <dd data-testid="cached-global-exec" className="font-bold text-zinc-900 dark:text-zinc-100">{renderInfo.globalExecNo}번째</dd>
        </div>
        <div>
          <dt className="text-zinc-500">이 prop 실행 횟수</dt>
          <dd data-testid="cached-category-exec" className="font-bold text-zinc-900 dark:text-zinc-100">{renderInfo.categoryExecNo}회</dd>
        </div>
      </dl>

      <ol className="space-y-1.5">
        {ranked.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="flex items-center gap-2">
              <span className="font-mono font-bold text-zinc-500">{index + 1}</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.name}</span>
            </span>
            <span className="font-mono text-zinc-600 dark:text-zinc-400">{item.price.toLocaleString()}원</span>
          </li>
        ))}
      </ol>

      {/* children은 읽거나 가공하지 않고 그대로 통과시킨다 (pass-through) */}
      {children}

      <CachedRenderReporter info={renderInfo} />
    </section>
  )
}
