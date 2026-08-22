'use client'
import React from 'react'
export function RuntimeNodejsEdgeDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono text-xs">
      <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-950 dark:bg-blue-950/20">
        <div className="font-bold text-blue-900 dark:text-blue-300">runtime = 'edge':</div>
        <div className="text-zinc-600 dark:text-zinc-400 mt-1">콜드스타트 0ms, V8 Isolate, 전세계 분산 배포</div>
      </div>
      <div className="rounded border border-purple-200 bg-purple-50/50 p-3 dark:border-purple-950 dark:bg-purple-950/20">
        <div className="font-bold text-purple-900 dark:text-purple-300">runtime = 'nodejs':</div>
        <div className="text-zinc-600 dark:text-zinc-400 mt-1">모든 Node.js 네이티브 모듈(fs, crypto, pg) 지원</div>
      </div>
    </div>
  )
}
