'use client'
import React from 'react'

export function CacheLifeHoursDemo() {
  return (
    <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-2 font-mono text-xs">
      <div className="font-bold text-emerald-950 dark:text-emerald-200">cacheLife("hours") 프리셋 타임라인:</div>
      <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-700 dark:text-zinc-300 pt-1">
        <div className="rounded bg-white p-2 border border-emerald-200 dark:bg-zinc-900 dark:border-emerald-950">• Stale: 5분</div>
        <div className="rounded bg-white p-2 border border-emerald-200 dark:bg-zinc-900 dark:border-emerald-950">• Revalidate: 1시간</div>
        <div className="rounded bg-white p-2 border border-emerald-200 dark:bg-zinc-900 dark:border-emerald-950">• Expire: 1일</div>
      </div>
    </div>
  )
}
