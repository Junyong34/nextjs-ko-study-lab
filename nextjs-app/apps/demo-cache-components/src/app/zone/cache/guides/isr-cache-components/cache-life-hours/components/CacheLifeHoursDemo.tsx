'use client'

import React, { useState, useTransition } from 'react'
import type { CachedHeroBanner } from '../types'
import { fetchComponentCacheAction } from '../actions'

export function CacheLifeHoursDemo() {
  const [banner, setBanner] = useState<CachedHeroBanner | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleFetch = (forceFresh: boolean = false) => {
    startTransition(async () => {
      const res = await fetchComponentCacheAction(forceFresh)
      setBanner(res)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 상단 프로필 명세 및 패치 실행 버튼 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">프로필:</span>
          <code className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            cacheLife('hours')
          </code>
          {banner && (
            <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {banner.hitType} ({banner.fetchLatencyMs}ms)
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleFetch(false)}
            disabled={isPending}
            className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
          >
            {isPending ? '캐시 패치 중...' : '컴포넌트 캐시 패치 실행'}
          </button>
        </div>
      </div>

      {/* 2. cacheLife("hours") 프리셋 타임라인 */}
      <div className="rounded-lg border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-2 font-mono text-xs">
        <div className="font-bold text-emerald-950 dark:text-emerald-200">
          cacheLife("hours") 프리셋 타임라인:
        </div>
        <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-700 dark:text-zinc-300 pt-1">
          <div className="rounded bg-white p-2 border border-emerald-200 dark:bg-zinc-900 dark:border-emerald-950">
            • Stale: 5분
          </div>
          <div className="rounded bg-white p-2 border border-emerald-200 dark:bg-zinc-900 dark:border-emerald-950">
            • Revalidate: 1시간
          </div>
          <div className="rounded bg-white p-2 border border-emerald-200 dark:bg-zinc-900 dark:border-emerald-950">
            • Expire: 1일
          </div>
        </div>
      </div>

      {/* 3. 캐시된 프로모션 배너 카드 */}
      {banner && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
            <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              {banner.discountRate}
            </span>
            <span className="font-mono text-[11px] text-zinc-400">
              캐시 생성: {banner.cachedAt} (ID: {banner.bannerId})
            </span>
          </div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{banner.title}</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{banner.subtitle}</p>
        </div>
      )}
    </div>
  )
}
