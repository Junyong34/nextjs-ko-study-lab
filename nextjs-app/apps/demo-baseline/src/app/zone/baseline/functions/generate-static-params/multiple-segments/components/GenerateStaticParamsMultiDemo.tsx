'use client'
import React from 'react'

export function GenerateStaticParamsMultiDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">사전 생성된 다중 세그먼트:</div>
      <div className="text-zinc-500">• /electronics/keyboard (정적 HTML 빌드됨)</div>
      <div className="text-zinc-500">• /fashion/sneakers (정적 HTML 빌드됨)</div>
    </div>
  )
}
