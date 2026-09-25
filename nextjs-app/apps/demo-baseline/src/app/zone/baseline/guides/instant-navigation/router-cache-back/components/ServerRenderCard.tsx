import React from 'react'
import { connection } from 'next/server'
import { RenderReporter } from './RenderReporter'
import { ROUTE_LABEL, SERVER_DELAY_MS, type RouteKey } from '../types'

const DESCRIPTION: Record<RouteKey, string> = {
  catalog: '키보드 · 마우스 · 모니터 암 등 12개 상품',
  product: '프로 무선 기계식 키보드 (저소음 적축)',
}

/**
 * 요청마다 서버에서 새로 렌더링되는 동적 page 본문.
 * connection()으로 요청 시점 렌더링을 강제하고, 렌더할 때마다 새 렌더 ID와 서버 시각을 만든다.
 * 같은 렌더 ID가 다시 보이면 서버가 다시 렌더하지 않았다는 뜻이다.
 */
export async function ServerRenderCard({ route }: { route: RouteKey }) {
  await connection()
  await new Promise((resolve) => setTimeout(resolve, SERVER_DELAY_MS))
  const renderId = crypto.randomUUID().slice(0, 8)
  const renderedAt = new Date().toISOString()

  return (
    <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="font-mono text-[10px] text-zinc-500">router-cache-back/{route}/page.tsx (동적, 서버 렌더)</div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{ROUTE_LABEL[route]}</div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{DESCRIPTION[route]}</p>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
          <dt className="text-zinc-500">렌더 ID</dt>
          <dd data-rcb-render={renderId}>{renderId}</dd>
          <dt className="text-zinc-500">서버 시각</dt>
          <dd>{renderedAt.slice(11, 23)}Z</dd>
        </dl>
      </div>
      <RenderReporter route={route} renderId={renderId} renderedAt={renderedAt} />
    </section>
  )
}
