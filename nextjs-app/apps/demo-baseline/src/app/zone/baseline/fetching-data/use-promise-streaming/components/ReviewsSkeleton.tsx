import React from 'react'

export function ReviewsSkeleton({ delayMs = 1200 }: { delayMs?: number }) {
  return (
    <div className="space-y-4 rounded-2xl border-2 border-amber-300 bg-amber-50/30 p-5 sm:p-6 dark:border-amber-700/60 dark:bg-amber-950/20 animate-pulse shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3 dark:border-amber-800">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-500 animate-ping" />
          <div className="h-4 w-40 rounded bg-amber-200 dark:bg-amber-800" />
        </div>
        <div className="h-5 w-32 rounded bg-amber-200 font-mono text-[10px] dark:bg-amber-800" />
      </div>

      <div className="space-y-3 pt-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-amber-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-3 w-16 rounded bg-amber-100 dark:bg-amber-900/60" />
            </div>
            <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-2.5 w-32 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="text-center text-xs font-mono font-bold text-amber-800 dark:text-amber-300 pt-1">
        ⏳ React 19 &lt;Suspense fallback&gt; 로딩 스켈레톤 렌더링 중... (서버 지연: {delayMs}ms 대기)
      </div>
    </div>
  )
}
