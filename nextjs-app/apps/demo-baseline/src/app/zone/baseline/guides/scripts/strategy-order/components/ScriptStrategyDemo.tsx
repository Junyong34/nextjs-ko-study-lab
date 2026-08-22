'use client'
import React from 'react'
export function ScriptStrategyDemo() {
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs">
      <div className="text-blue-600 dark:text-blue-400">• strategy="beforeInteractive": 봇 탐지 및 필수 폴리필</div>
      <div className="text-emerald-600 dark:text-emerald-400">• strategy="afterInteractive": 구글 애널리틱스 (기본값)</div>
      <div className="text-purple-600 dark:text-purple-400">• strategy="lazyOnload": 하단 실시간 상담 챗봇 위젯</div>
    </div>
  )
}
