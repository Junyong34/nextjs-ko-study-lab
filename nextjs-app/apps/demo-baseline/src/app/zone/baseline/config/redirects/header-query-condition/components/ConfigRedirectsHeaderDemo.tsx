'use client'
import React from 'react'

export function ConfigRedirectsHeaderDemo() {
  return (
    <div className="rounded border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-950 dark:bg-purple-950/20 font-mono text-xs space-y-1">
      <div className="font-bold text-purple-950 dark:text-purple-200">has: [ {'{ type: "header", key: "x-beta-tester", value: "true" }'} ]</div>
      <div className="text-zinc-600 dark:text-zinc-400">→ /beta-checkout으로 자동 307 리다이렉트</div>
    </div>
  )
}
