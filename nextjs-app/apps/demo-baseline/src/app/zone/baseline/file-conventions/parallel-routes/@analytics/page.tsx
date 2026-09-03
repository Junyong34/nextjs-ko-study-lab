import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/parallel-routes/@analytics')

import React from 'react'

export default function AnalyticsSlotPage() {
  return (
    <div className="rounded border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200">
          [분석] 실시간 매출/방문자 분석 슬롯 (@analytics)
        </h4>
        <span className="rounded bg-blue-600 px-1.5 py-0.2 font-mono text-[9px] font-bold text-white">
          슬롯 1 (독립 렌더)
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <div className="rounded bg-white p-2 border border-blue-100 dark:bg-zinc-900 dark:border-blue-950">
          <div className="text-[10px] text-zinc-400">오늘 방문자</div>
          <div className="text-sm font-bold text-blue-600">12,840명</div>
        </div>
        <div className="rounded bg-white p-2 border border-blue-100 dark:bg-zinc-900 dark:border-blue-950">
          <div className="text-[10px] text-zinc-400">실시간 결제 전환율</div>
          <div className="text-sm font-bold text-emerald-600">4.82%</div>
        </div>
      </div>
    </div>
  )
}
