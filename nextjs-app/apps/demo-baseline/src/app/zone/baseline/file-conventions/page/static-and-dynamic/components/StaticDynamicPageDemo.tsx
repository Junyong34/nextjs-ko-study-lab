'use client'
import React from 'react'
export function StaticDynamicPageDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-emerald-600 font-bold">○ Static Page</span>
        <p className="text-zinc-500 mt-1">빌드 타임 HTML 생성 (0ms 서빙)</p>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-purple-600 font-bold">ƒ Dynamic Page</span>
        <p className="text-zinc-500 mt-1">요청 시점 서버 온디맨드 렌더링</p>
      </div>
    </div>
  )
}
