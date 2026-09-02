import React from 'react'

export function RecommendationsSkeleton({ delayMs = 2500 }: { delayMs?: number }) {
  return (
    <div className="space-y-4 rounded-2xl border-2 border-purple-300 bg-purple-50/30 p-5 sm:p-6 dark:border-purple-700/60 dark:bg-purple-950/20 animate-pulse shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 pb-3 dark:border-purple-800">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-purple-500 animate-ping" />
          <div className="h-4 w-44 rounded bg-purple-200 dark:bg-purple-800" />
        </div>
        <div className="h-5 w-36 rounded bg-purple-200 font-mono text-[10px] dark:bg-purple-800" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-purple-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs space-y-2"
          >
            <div className="h-3 w-16 rounded bg-purple-100 dark:bg-purple-900/60" />
            <div className="h-3.5 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="text-center text-xs font-mono font-bold text-purple-800 dark:text-purple-300 pt-1">
        ⏳ React 19 &lt;Suspense fallback 2&gt; 로딩 스켈레톤 대기 중... (AI 추천 서버 지연: {delayMs}ms 대기)
      </div>
    </div>
  )
}
