'use client'
import React from 'react'

export function EdgeV8WebApisDemo() {
  return (
    <div className="rounded border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-950 dark:bg-blue-950/20 font-mono text-xs space-y-1">
      <div className="font-bold text-blue-950 dark:text-blue-200">export const runtime = 'edge';</div>
      <div className="text-zinc-600 dark:text-zinc-400">• V8 Isolate 콜드스타트: 2ms</div>
      <div className="text-zinc-600 dark:text-zinc-400">• 글로벌 Web Crypto 서명 검증 지원</div>
    </div>
  )
}
