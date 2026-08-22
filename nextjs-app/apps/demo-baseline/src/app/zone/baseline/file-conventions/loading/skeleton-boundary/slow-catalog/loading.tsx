import React from 'react'

export default function CatalogLoading() {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 animate-pulse">
      <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="h-3 w-64 rounded bg-zinc-100 dark:bg-zinc-900"></div>
        </div>
        <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800"></div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
            <div className="h-24 w-full rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-900"></div>
            <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="h-6 w-14 rounded bg-zinc-300 dark:bg-zinc-700"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-zinc-400 font-mono pt-2">
        • loading.tsx 스켈레톤 바운더리 활성화: 서버 스트리밍 대기 중...
      </div>
    </div>
  )
}
