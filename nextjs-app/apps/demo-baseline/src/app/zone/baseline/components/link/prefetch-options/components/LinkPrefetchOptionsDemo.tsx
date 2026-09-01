'use client'
import React from 'react'
export function LinkPrefetchOptionsDemo() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 font-mono text-xs">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900">• prefetch={'{null}'}: 기본 auto</div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900">• prefetch={'{true}'}: 전체 prefetch</div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900">• prefetch={'{false}'}: 호버 시점만</div>
    </div>
  )
}
