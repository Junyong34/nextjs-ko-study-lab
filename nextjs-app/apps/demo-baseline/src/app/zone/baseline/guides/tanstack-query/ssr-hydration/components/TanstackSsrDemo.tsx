'use client'
import React from 'react'
export function TanstackSsrDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">HydrationBoundary 하이드레이션 완료</span>
        <span className="rounded bg-emerald-100 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">0ms Loading</span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">서버에서 prefetch된 쿼리 데이터가 클라이언트에 즉시 주입되어 깜빡임 없이 표시됩니다.</p>
    </div>
  )
}
