import type { CategoryStatsResult } from '../types'

function Card({ label, directive, stats }: { label: string; directive: string; stats: CategoryStatsResult }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{label}</span>
        <span className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {directive}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
        <dt className="text-zinc-500">cacheId</dt>
        <dd className="text-right font-bold">#{stats.cacheId}</dd>
        <dt className="text-zinc-500">본문 실행 시각</dt>
        <dd className="text-right">{stats.generatedAt}</dd>
        <dt className="text-zinc-500">전체 실행 순번</dt>
        <dd className="text-right">{stats.globalExecNo}회</dd>
        <dt className="text-zinc-500">이 인자 실행 횟수</dt>
        <dd className="text-right">{stats.argsExecNo}회</dd>
        <dt className="text-zinc-500">평균가</dt>
        <dd className="text-right">
          {stats.avgPrice.toLocaleString('ko-KR')} {stats.currency}
        </dd>
      </dl>
    </div>
  )
}

/**
 * 같은 인자(category, currency)로 default·remote 두 지시어를 나란히 호출한 결과.
 * cacheId가 서로 다른 것은 정상이다 — 캐시 키에 함수 ID가 포함되므로 지시어가 다르면
 * 로직이 같아도 별도 항목으로 저장된다. "같은 저장소를 쓰는가"는 이 카드가 아니라
 * 아래 HandlerIdentityCard가 확인한다.
 */
export function StatsCompareCard({
  defaultStats,
  remoteStats,
}: {
  defaultStats: CategoryStatsResult
  remoteStats: CategoryStatsResult
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Card label="getDefaultCategoryStats()" directive="use cache" stats={defaultStats} />
      <Card label="getRemoteCategoryStats()" directive="use cache: remote" stats={remoteStats} />
    </div>
  )
}
