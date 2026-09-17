import React from 'react'

export function RecommendedProductsSkeleton() {
  return (
    <div className="space-y-4 rounded-md border-2 border-blue-200 bg-blue-50/20 p-4 dark:border-blue-800/60 dark:bg-blue-950/10 animate-pulse">
      <div className="flex items-center justify-between border-b border-blue-100 pb-2 dark:border-blue-900">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping" />
          <div className="h-3.5 w-40 rounded bg-blue-200 dark:bg-blue-800" />
        </div>
        <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          1500ms 대기 (1단계)
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded border border-zinc-200 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1.5"
          >
            <div className="h-2 w-10 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-14 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        ))}
      </div>

      <div className="text-center text-xs font-mono text-blue-800 dark:text-blue-300">
        [1차 대기] 함께 구매하면 좋은 추천 상품 스트리밍 로딩 중 (1500ms)...
      </div>
    </div>
  )
}
