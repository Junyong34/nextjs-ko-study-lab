'use client'
import React, { useState } from 'react'
export function HydrationBoundaryDemo() {
  const [mounted, setMounted] = useState(false)
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">하이드레이션 상태: {mounted ? '[확인] 클라이언트 하이드레이션 완료' : '서버 HTML 렌더'}</div>
      <button type="button" onClick={() => setMounted(true)} className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">하이드레이션 활성화</button>
    </div>
  )
}
