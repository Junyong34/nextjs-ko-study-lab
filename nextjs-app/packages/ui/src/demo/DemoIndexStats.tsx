import React from 'react'
import { Layers, CheckCircle2 } from 'lucide-react'

export interface DemoIndexStatsProps {
  totalCount: number
  doneCount: number
}

/** 데모 색인 상단의 지표 타일 3개. */
export function DemoIndexStats({ totalCount, doneCount }: DemoIndexStatsProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">총 데모 수</span>
        <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {totalCount}개
        </div>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">구현 완료</span>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {doneCount}
          </span>
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </div>
      </div>
      <div className="col-span-2 sm:col-span-1 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">실행 환경</span>
        <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <Layers className="h-4 w-4" />
          <span>독립 인터랙티브 샌드박스</span>
        </div>
      </div>
    </div>
  )
}
