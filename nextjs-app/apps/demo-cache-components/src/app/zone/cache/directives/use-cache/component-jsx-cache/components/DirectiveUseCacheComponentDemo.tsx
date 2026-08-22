'use client'
import React from 'react'

export function DirectiveUseCacheComponentDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">캐시된 &lt;ProductHero /&gt; 컴포넌트:</div>
      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 font-mono text-emerald-600">
        [확인] JSX 렌더 결과 캐시 적중 (서버 렌더 시간 0ms)
      </div>
    </div>
  )
}
