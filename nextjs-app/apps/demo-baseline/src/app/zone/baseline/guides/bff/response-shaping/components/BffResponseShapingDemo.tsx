'use client'
import React from 'react'
export function BffResponseShapingDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono text-xs">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="font-bold text-zinc-500">원본 백엔드 (50개 필드, 120 KB):</div>
        <div className="text-zinc-400 mt-1">{'{ id, internal_audit, raw_logs, ... }'}</div>
      </div>
      <div className="rounded border border-emerald-300 bg-emerald-50/50 p-3 dark:border-emerald-950 dark:bg-emerald-950/20">
        <div className="font-bold text-emerald-900 dark:text-emerald-300">BFF 정제 (4개 필드, 2 KB):</div>
        <div className="text-emerald-600 dark:text-emerald-400 mt-1">{'{ id, title, price, thumbnail }'}</div>
      </div>
    </div>
  )
}
