'use client'
import React, { useState } from 'react'
import { VerificationFooter } from './VerificationFooter'

export interface ServerVsClientDemoProps {
  children: React.ReactNode
}

export function ServerVsClientDemo({ children }: ServerVsClientDemoProps) {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {children}
        <div className="rounded border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950 dark:text-emerald-200">[즉시] Client Component (RCC)</span>
            <span className="rounded bg-emerald-600 px-1.5 py-0.2 font-mono text-[9px] text-white">Interactive</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">브라우저에서 이벤트 리스너와 상태를 관리합니다.</p>
          <div className="flex items-center gap-2 pt-1">
            <button type="button" onClick={() => setCount(c => c + 1)} className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 cursor-pointer">
              클릭 카운트: {count}
            </button>
          </div>
        </div>
      </div>
      <VerificationFooter count={count} />
    </div>
  )
}
