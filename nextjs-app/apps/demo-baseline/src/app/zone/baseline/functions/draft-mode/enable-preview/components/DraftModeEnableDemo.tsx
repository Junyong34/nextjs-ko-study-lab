'use client'
import React, { useState } from 'react'

export function DraftModeEnableDemo() {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">Draft Mode: {enabled ? ' 활성화됨 (__prerender_bypass 발급)' : '비활성 (정적 캐시 서빙)'}</div>
      <button type="button" onClick={() => setEnabled(true)} className="rounded bg-purple-600 px-3.5 py-1.5 font-bold text-white shadow-2xs cursor-pointer">
        draftMode().enable() 실행
      </button>
    </div>
  )
}
