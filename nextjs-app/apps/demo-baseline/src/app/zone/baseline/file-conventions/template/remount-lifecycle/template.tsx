'use client'
import React, { useEffect, useState } from 'react'

export default function RemountTemplate({ children }: { children: React.ReactNode }) {
  const [templateInput, setTemplateInput] = useState('')
  const [mountedAt, setMountedAt] = useState<string>('')

  useEffect(() => {
    setMountedAt(new Date().toLocaleTimeString())
  }, [])

  return (
    <div className="space-y-3 rounded-lg border-2 border-indigo-500/40 bg-indigo-50/20 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200 pb-2 dark:border-indigo-900">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
            template.tsx (페이지 전환 시 매번 재마운트 & 상태 리셋)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            마운트 시각: {mountedAt || '마운트 중...'}
          </span>
          <input
            type="text"
            value={templateInput}
            onChange={(e) => setTemplateInput(e.target.value)}
            placeholder="경로 이동 시 초기화됨..."
            className="rounded border border-indigo-300 bg-white px-2 py-1 text-xs font-medium dark:bg-zinc-900 dark:border-indigo-800"
          />
        </div>
      </div>
      {children}
    </div>
  )
}
