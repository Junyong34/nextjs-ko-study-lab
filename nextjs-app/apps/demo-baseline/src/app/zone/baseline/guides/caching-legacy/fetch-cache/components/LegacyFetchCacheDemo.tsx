'use client'
import React from 'react'

export function LegacyFetchCacheDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-1">
        <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">fetch(url, {'{ next: { revalidate: 60 } }'})</span>
        <p className="text-[11px] text-zinc-500">개별 HTTP fetch 요청 단위 60초 캐싱 (Next.js 14)</p>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-1">
        <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">export const revalidate = 60</span>
        <p className="text-[11px] text-zinc-500">라우트 세그먼트 전체 60초 ISR 설정 (Next.js 14)</p>
      </div>
    </div>
  )
}
