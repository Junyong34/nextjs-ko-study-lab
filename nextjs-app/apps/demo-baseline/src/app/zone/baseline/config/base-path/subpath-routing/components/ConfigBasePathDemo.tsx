'use client'
import React from 'react'

export function ConfigBasePathDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">next.config.ts: basePath = '/shop'</div>
      <div className="text-emerald-600">• 라우트: /shop/products/101</div>
      <div className="text-emerald-600">• 정적 에셋: /shop/_next/static/...</div>
    </div>
  )
}
