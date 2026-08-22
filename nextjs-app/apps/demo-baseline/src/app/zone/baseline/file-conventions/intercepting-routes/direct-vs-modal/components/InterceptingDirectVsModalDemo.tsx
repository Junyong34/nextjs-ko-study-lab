'use client'
import React from 'react'
export function InterceptingDirectVsModalDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
      <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-950 dark:bg-blue-950/20">
        <span className="font-bold text-blue-900 dark:text-blue-300">클라이언트 탐색:</span>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">(..)products/[id] 모달 오버레이</p>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">직접 URL 입력:</span>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">products/[id]/page.tsx 전체 독립 페이지</p>
      </div>
    </div>
  )
}
