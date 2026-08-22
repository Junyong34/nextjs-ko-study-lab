'use client'
import React, { useState } from 'react'
export function LinkSoftNavScrollDemo() {
  const [scrollOpt, setScrollOpt] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">현재 링크 설정: &lt;Link scroll={'{' + String(scrollOpt) + '}'}&gt;</div>
      <button type="button" onClick={() => setScrollOpt(s => !s)} className="rounded bg-blue-600 px-3 py-1 font-bold text-white cursor-pointer">
        scroll 속성 토글 (현재: {String(scrollOpt)})
      </button>
    </div>
  )
}
