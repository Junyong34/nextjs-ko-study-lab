'use client'
import React, { useState } from 'react'

export function PartialPrefetchDemo() {
  const [prefetched, setPrefetched] = useState(false)
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800 text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">호버 기반 정적 셸 표시</span>
        <span className="font-mono text-emerald-600 font-bold">{prefetched ? '[확인] 정적 셸 표시됨' : '호버 대기 중'}</span>
      </div>
      <div onMouseEnter={() => setPrefetched(true)} className="rounded border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-700 hover:border-blue-500 cursor-pointer dark:border-zinc-700 dark:text-zinc-300">
        여기에 마우스를 올리면 정적 레이아웃 셸이 표시됩니다.
      </div>
    </div>
  )
}
