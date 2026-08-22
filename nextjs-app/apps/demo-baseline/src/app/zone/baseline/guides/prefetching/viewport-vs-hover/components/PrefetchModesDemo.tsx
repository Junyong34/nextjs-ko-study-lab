'use client'
import React, { useState } from 'react'

export function PrefetchModesDemo() {
  const [logs, setLogs] = useState<string[]>([])
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        <div onMouseEnter={() => setLogs(p => [...p, 'Link 1 (기본값): 뷰포트 진입 시 이미 사전 로드됨'])} className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 cursor-pointer">
          <div className="font-bold text-blue-900 dark:text-blue-200">&lt;Link href="/shop"&gt;</div>
          <div className="text-zinc-500 mt-1">뷰포트 진입 즉시 자동 prefetch</div>
        </div>
        <div onMouseEnter={() => setLogs(p => [...p, 'Link 2 (prefetch={false}): 마우스 호버 시점에 방금 프리패치됨'])} className="rounded border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900 cursor-pointer">
          <div className="font-bold text-amber-900 dark:text-amber-200">&lt;Link href="/spec" prefetch={'{false}'}&gt;</div>
          <div className="text-zinc-500 mt-1">호버 시점에만 프리패치 발생</div>
        </div>
      </div>
      <div className="rounded bg-zinc-900 p-2 font-mono text-[11px] text-zinc-300 max-h-24 overflow-y-auto">
        {logs.length === 0 ? '링크에 마우스를 올려 프리패치 로그를 확인하세요.' : logs.map((l, i) => <div key={i}>• {l}</div>)}
      </div>
    </div>
  )
}
