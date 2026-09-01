'use client'
import React from 'react'

export function ConfigStaleTimesDemo() {
  return (
    <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 font-mono text-xs space-y-1">
      <div className="font-bold text-emerald-950 dark:text-emerald-200">staleTimes: {'{ dynamic: 0, static: 300 }'}</div>
      <div className="text-zinc-600 dark:text-zinc-400">• 다이나믹 페이지: 0초 (탐색할 때마다 서버 요청)</div>
      <div className="text-zinc-600 dark:text-zinc-400">• 정적 페이지: 5분 (캐시된 화면 복원)</div>
    </div>
  )
}
