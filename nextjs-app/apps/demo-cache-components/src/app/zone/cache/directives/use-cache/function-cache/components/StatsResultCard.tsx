import { formatServerTime, type CategoryStats } from '../types'

const money = (value: number, currency: string) =>
  currency === 'USD' ? `$${value.toLocaleString('en-US')}` : `${value.toLocaleString('ko-KR')}원`

/** 캐시 함수가 돌려준 값을 그대로 표시한다. 캐시 HIT이면 이전 실행 때 기록된 값이 보인다. */
export function StatsResultCard({
  label,
  testId,
  stats,
  showRows = false,
}: {
  label: string
  testId: string
  stats: CategoryStats
  showRows?: boolean
}) {
  return (
    <section
      data-testid={testId}
      className="space-y-2 rounded-lg border border-indigo-200 bg-indigo-50/40 p-3 dark:border-indigo-900/70 dark:bg-indigo-950/20"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-indigo-100 pb-1.5 dark:border-indigo-900/50">
        <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{label}</h3>
        <code className="font-mono text-[10px] text-indigo-700 dark:text-indigo-300">
          getCategoryStats(&apos;{stats.category}&apos;, {'{'} currency: &apos;{stats.currency}&apos; {'}'})
        </code>
      </header>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
        <dt className="text-zinc-500">cacheId</dt>
        <dd data-testid={`${testId}-cache-id`} className="font-bold text-indigo-700 dark:text-indigo-300">
          #{stats.cacheId}
        </dd>
        <dt className="text-zinc-500">본문 실행 시각</dt>
        <dd data-testid={`${testId}-generated-at`} className="font-bold text-indigo-700 dark:text-indigo-300">
          {formatServerTime(new Date(stats.generatedAt))}
        </dd>
        <dt className="text-zinc-500">서버 전체 실행 순번</dt>
        <dd data-testid={`${testId}-global-exec`}>{stats.globalExecNo}번째</dd>
        <dt className="text-zinc-500">이 인자 실행 횟수</dt>
        <dd data-testid={`${testId}-args-exec`}>{stats.argsExecNo}회</dd>
        <dt className="text-zinc-500">상품 수 / 총 재고</dt>
        <dd>
          {stats.productCount}개 / {stats.totalStock}개
        </dd>
        <dt className="text-zinc-500">평균가</dt>
        <dd>{money(stats.avgPrice, stats.currency)}</dd>
      </dl>
      {showRows && (
        <ul className="space-y-1 border-t border-indigo-100 pt-1.5 text-[11px] dark:border-indigo-900/50">
          {(stats.priceByProduct instanceof Map ? [...stats.priceByProduct] : []).map(([name, price]) => (
            <li key={name} className="flex justify-between gap-2">
              <span className="truncate text-zinc-700 dark:text-zinc-300">{name}</span>
              <span className="shrink-0 font-mono text-zinc-600 dark:text-zinc-400">{money(price, stats.currency)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
