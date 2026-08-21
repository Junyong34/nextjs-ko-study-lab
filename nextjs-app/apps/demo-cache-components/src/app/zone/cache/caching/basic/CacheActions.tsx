'use client'

import React, { useTransition } from 'react'

interface CacheActionsProps {
  onRevalidate: () => Promise<void>
}

export function CacheActions({ onRevalidate }: CacheActionsProps) {
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleRevalidate = () => {
    startTransition(async () => {
      await onRevalidate()
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-xs transition hover:bg-zinc-50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
      >
        <svg
          className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>브라우저 새로고침</span>
      </button>

      <button
        type="button"
        onClick={handleRevalidate}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-amber-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
      >
        <svg
          className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span>{isPending ? '캐시 무효화 중...' : '캐시 무효화 (revalidateTag)'}</span>
      </button>
    </div>
  )
}
