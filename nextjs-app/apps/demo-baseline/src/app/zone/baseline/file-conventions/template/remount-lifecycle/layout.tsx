'use client'
import React, { useState } from 'react'

export default function RemountLayout({ children }: { children: React.ReactNode }) {
  const [persistentText, setPersistentText] = useState('')

  return (
    <div className="space-y-4 rounded-lg border-2 border-emerald-500/40 bg-emerald-50/20 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3 dark:border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
            layout.tsx (상태 보존 지속 레이아웃)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500">레이아웃 보존 입력:</span>
          <input
            type="text"
            value={persistentText}
            onChange={(e) => setPersistentText(e.target.value)}
            placeholder="경로 이동해도 유지됨..."
            className="rounded border border-emerald-300 bg-white px-2 py-1 text-xs font-medium dark:bg-zinc-900 dark:border-emerald-800"
          />
        </div>
      </div>
      {children}
    </div>
  )
}
