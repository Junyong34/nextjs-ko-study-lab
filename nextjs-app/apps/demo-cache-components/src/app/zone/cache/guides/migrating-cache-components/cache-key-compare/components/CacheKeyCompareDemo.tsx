'use client'
import React from 'react'
export function CacheKeyCompareDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="font-bold text-zinc-900 dark:text-zinc-100">과거 수동 키:</div>
        <div className="text-zinc-500 mt-1">['user-profile', userId, region].join(':')</div>
      </div>
      <div className="rounded border border-emerald-300 bg-emerald-50/50 p-3 dark:border-emerald-950 dark:bg-emerald-950/20">
        <div className="font-bold text-emerald-950 dark:text-emerald-200">Next 16 'use cache':</div>
        <div className="text-emerald-600 dark:text-emerald-400 mt-1">인자 (userId, region) 자동 해싱</div>
      </div>
    </div>
  )
}
