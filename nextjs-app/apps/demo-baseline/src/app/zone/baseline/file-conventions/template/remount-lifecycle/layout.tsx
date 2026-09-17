'use client'
import React, { useEffect, useState } from 'react'
import { recordLayoutMount, useRemountCounts } from './hooks/useRemountStore'

export default function RemountLayout({ children }: { children: React.ReactNode }) {
  const [persistentText, setPersistentText] = useState('')
  const { layoutMountCount, layoutMountedAt } = useRemountCounts()

  useEffect(() => {
    recordLayoutMount()
  }, [])

  return (
    <div className="space-y-4 rounded-lg border-2 border-emerald-500/40 bg-emerald-50/20 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3 dark:border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
            layout.tsx (상태 보존 지속 레이아웃)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            layout 마운트 횟수: {layoutMountCount || '집계 중...'}
          </span>
          <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            최초 마운트 시각: {layoutMountedAt || '집계 중...'}
          </span>
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
