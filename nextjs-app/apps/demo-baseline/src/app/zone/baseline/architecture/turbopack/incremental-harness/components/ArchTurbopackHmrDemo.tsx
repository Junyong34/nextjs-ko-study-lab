'use client'
import React from 'react'

export function ArchTurbopackHmrDemo() {
  return (
    <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 font-mono text-xs space-y-1">
      <div className="font-bold text-emerald-950 dark:text-emerald-200">[즉시] Turbopack Fast Refresh:</div>
      <div className="text-emerald-600 dark:text-emerald-400">• 증분 HMR 갱신 시간: 8ms</div>
      <div className="text-zinc-600 dark:text-zinc-400">• 클라이언트 React 상태 100% 보존</div>
    </div>
  )
}
