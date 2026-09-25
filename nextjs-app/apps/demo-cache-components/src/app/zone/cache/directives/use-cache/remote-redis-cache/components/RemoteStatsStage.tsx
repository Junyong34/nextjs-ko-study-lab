import { connection } from 'next/server'
import { getDefaultCategoryStats, getRemoteCategoryStats } from '../queries'
import { probeCacheHandlerIdentity } from '../handler-probe'
import { formatServerTime, toCategory, toCurrency, type RequestObservation } from '../types'
import { RemoteStatsControls } from './RemoteStatsControls'
import { StatsCompareCard } from './StatsCompareCard'
import { HandlerIdentityCard } from './HandlerIdentityCard'
import { RequestReporter } from './ObservationContext'

/**
 * 캐시 밖(요청 시점)에서 searchParams를 읽고, 직렬화 가능한 값만 캐시 함수의 인자로 넘긴다.
 * connection()으로 요청 시점 렌더링을 명시한다 — 문서가 말하는 "remote 캐싱이 가장 유리한 상황"
 * (static shell 밖, 매 요청마다 컴포넌트가 실행되는 상황)을 실제로 만든다.
 */
export async function RemoteStatsStage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  await connection()
  const category = toCategory(params.category)
  const currency = toCurrency(params.currency)

  const [defaultStats, remoteStats] = await Promise.all([
    getDefaultCategoryStats(category, currency),
    getRemoteCategoryStats(category, currency),
  ])
  // 두 캐시 함수가 이미 실행됐으니(캐시 HIT이어도 핸들러 초기화는 이미 끝난 상태) 레지스트리를 읽는다.
  const handlerProbe = probeCacheHandlerIdentity()

  const observation: RequestObservation = {
    requestId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    requestAt: formatServerTime(new Date()),
    argsKey: `${category}|${currency}`,
    defaultStats,
    remoteStats,
    handlerProbe,
  }

  return (
    <div className="space-y-3">
      <RemoteStatsControls category={category} currency={currency} />
      <div className="rounded-md border border-dashed border-emerald-400 bg-emerald-50/60 px-3 py-2 font-mono text-[11px] dark:border-emerald-800 dark:bg-emerald-950/20">
        <span className="font-sans font-semibold text-emerald-800 dark:text-emerald-300">이번 요청 (캐시 밖) </span>
        <span className="text-zinc-500">요청 시각 </span>
        <strong className="text-emerald-700 dark:text-emerald-300">{observation.requestAt}</strong>
        <span className="ml-3 text-zinc-500">요청 ID </span>
        <strong className="text-emerald-700 dark:text-emerald-300">#{observation.requestId}</strong>
      </div>
      <StatsCompareCard defaultStats={defaultStats} remoteStats={remoteStats} />
      <HandlerIdentityCard probe={handlerProbe} />
      <RequestReporter observation={observation} />
    </div>
  )
}
