import React from 'react'
import { RenderReporter } from './RenderReporter'
import { ROUTE_LABEL, type RouteKey } from '../types'
import type { RenderStamp } from '../lib/stamps'

const DESCRIPTION: Record<RouteKey, string> = {
  static: "동적 API 없이 'use cache' 값만 쓰는 page — prerender 대상이라 staleTimes.static이 적용됩니다.",
  dynamic: 'connection() 이후 요청마다 렌더하는 page — 동적 부분은 staleTimes.dynamic(기본 0초)이 적용됩니다.',
}

export function StampCard({ route, stamp }: { route: RouteKey; stamp: RenderStamp }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-zinc-500">router-cache-tuning/{route}/page.tsx</div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{ROUTE_LABEL[route]}</div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{DESCRIPTION[route]}</p>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
          <dt className="text-zinc-500">렌더 ID</dt>
          <dd>{stamp.id}</dd>
          <dt className="text-zinc-500">서버 시각</dt>
          <dd>{stamp.at.slice(11, 23)}Z</dd>
        </dl>
      </div>
      <RenderReporter route={route} renderId={stamp.id} />
    </section>
  )
}
