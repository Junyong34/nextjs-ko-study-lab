import React from 'react'

export function LiveReviewSkeleton() {
  return (
    <div className="space-y-3 rounded-md border-2 border-emerald-200 bg-emerald-50/20 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/10 animate-pulse">
      <div className="flex items-center justify-between border-b border-emerald-100 pb-2 dark:border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div className="h-3.5 w-36 rounded bg-emerald-200 dark:bg-emerald-800" />
        </div>
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          3000ms 대기 (2단계)
        </span>
      </div>

      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded border border-zinc-200 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="h-2.5 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="text-center text-xs font-mono text-emerald-800 dark:text-emerald-300">
        [2차 대기] 구매 고객 실시간 후기 스트리밍 수신 중 (3000ms)...
      </div>
    </div>
  )
}
