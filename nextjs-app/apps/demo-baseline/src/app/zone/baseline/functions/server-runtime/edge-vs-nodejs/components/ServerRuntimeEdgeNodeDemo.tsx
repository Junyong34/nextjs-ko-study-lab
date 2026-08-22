'use client'
import React from 'react'

export function ServerRuntimeEdgeNodeDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono text-xs">
      <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-950 dark:bg-blue-950/20">
        <div className="font-bold text-blue-900 dark:text-blue-300">Edge Runtime:</div>
        <div className="text-zinc-600 dark:text-zinc-400 mt-1">글로벌 CDN 엣지 분산 실행</div>
      </div>
      <div className="rounded border border-purple-200 bg-purple-50/50 p-3 dark:border-purple-950 dark:bg-purple-950/20">
        <div className="font-bold text-purple-900 dark:text-purple-300">Node.js Runtime:</div>
        <div className="text-zinc-600 dark:text-zinc-400 mt-1">풀 스택 라이브러리 및 파일시스템</div>
      </div>
    </div>
  )
}
