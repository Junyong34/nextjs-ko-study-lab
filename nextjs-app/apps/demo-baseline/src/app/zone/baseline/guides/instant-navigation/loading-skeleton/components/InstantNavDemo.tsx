'use client'
import React, { useState } from 'react'
export function InstantNavDemo() {
  const [page, setPage] = useState('home')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2">
        <button type="button" onClick={() => setPage('home')} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">홈 (0ms 즉시 전환)</button>
        <button type="button" onClick={() => setPage('shop')} className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">쇼핑몰 (스켈레톤 즉시 표시)</button>
      </div>
      <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400">현재 활성 세그먼트: /{page}</div>
    </div>
  )
}
