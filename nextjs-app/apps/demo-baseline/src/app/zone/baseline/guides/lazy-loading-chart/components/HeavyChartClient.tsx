'use client'

import React from 'react'

const MONTHLY_SALES = [
  { month: '1월', sales: 4200, height: '40%' },
  { month: '2월', sales: 6800, height: '65%' },
  { month: '3월', sales: 5100, height: '50%' },
  { month: '4월', sales: 8900, height: '85%' },
  { month: '5월', sales: 7400, height: '70%' },
  { month: '6월', sales: 10500, height: '100%' },
]

export default function HeavyChartClient() {
  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          2026 상반기 월별 매출 추이 분석 (무거운 차트 컴포넌트)
        </h4>
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          next/dynamic 지연 로드 완료 (클라이언트 온디맨드 마운트)
        </span>
      </div>

      {/* SVG/CSS 바 차트 */}
      <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2">
        {MONTHLY_SALES.map((item) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="font-mono text-[10px] text-zinc-500 font-bold">
              {item.sales.toLocaleString()}
            </span>
            <div
              className="w-full rounded-t bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-500 shadow-2xs hover:opacity-80"
              style={{ height: item.height }}
            />
            <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
