import React from 'react'

export function ReviewsSkeleton() {
  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-16 rounded bg-amber-100 dark:bg-amber-950/60" />
      </div>

      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 space-y-1.5"
          >
            <div className="flex justify-between">
              <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-3 w-12 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="text-[11px] text-zinc-400 font-mono text-center">
        [대기] React 19 Suspense Fallback 로딩 중 (스트리밍 수신 대기)...
      </div>
    </div>
  )
}
