'use client'
import React from 'react'
export function StyleRegistryDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="text-zinc-500">// useServerInsertedHTML을 통해 HTML {'<'}head{'>'}에 사전 주입된 스타일:</div>
      <div className="text-purple-600 dark:text-purple-400">{'<'}style data-styled="active"{'>'}.btn-primary {'{ background: #000; color: #fff; }'}{'<'}/style{'>'}</div>
    </div>
  )
}
