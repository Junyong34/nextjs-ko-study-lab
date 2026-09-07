import React from 'react'

export function ChunkSkeleton({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded bg-white p-2.5 text-xs font-mono border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 animate-pulse">
      <span className="rounded bg-zinc-300 px-1.5 py-0.2 text-[10px] font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
        LOADING
      </span>
      <span className="text-zinc-400 dark:text-zinc-500">{label}</span>
    </div>
  )
}
