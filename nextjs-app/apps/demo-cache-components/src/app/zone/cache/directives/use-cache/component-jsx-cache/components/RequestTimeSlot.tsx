import { connection } from 'next/server'
import { formatServerTime, type RankingCategory } from '../types'
import { RequestReporter } from './ObservationContext'

/**
 * 캐시된 컴포넌트의 children 슬롯에 끼워 넣는 동적 영역.
 * connection()으로 요청 시점 렌더링을 명시하므로 매 요청마다 새로 실행된다.
 */
export async function RequestTimeSlot({ category }: { category: RankingCategory }) {
  await connection()
  const info = {
    category,
    requestId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    requestAt: formatServerTime(new Date()),
  }

  return (
    <div className="rounded-md border border-dashed border-emerald-400 bg-emerald-50/60 px-3 py-2 font-mono text-[11px] dark:border-emerald-800 dark:bg-emerald-950/20">
      <div className="mb-1 font-sans text-xs font-semibold text-emerald-800 dark:text-emerald-300">
        children 슬롯 (캐시 밖, 요청마다 렌더)
      </div>
      <span className="text-zinc-500">요청 시각 </span>
      <strong data-testid="request-at" className="text-emerald-700 dark:text-emerald-300">{info.requestAt}</strong>
      <span className="ml-3 text-zinc-500">요청 ID </span>
      <strong data-testid="request-id" className="text-emerald-700 dark:text-emerald-300">#{info.requestId}</strong>
      <RequestReporter info={info} />
    </div>
  )
}
