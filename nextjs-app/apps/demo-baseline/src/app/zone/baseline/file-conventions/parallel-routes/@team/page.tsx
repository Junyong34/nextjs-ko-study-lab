import React from 'react'

export default function TeamSlotPage() {
  return (
    <div className="rounded border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/50 dark:bg-purple-950/20 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-purple-950 dark:text-purple-200">
           운영팀 당직 현황 슬롯 (@team)
        </h4>
        <span className="rounded bg-purple-600 px-1.5 py-0.2 font-mono text-[9px] font-bold text-white">
          슬롯 2 (독립 렌더)
        </span>
      </div>
      <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center justify-between rounded bg-white p-2 border border-purple-100 dark:bg-zinc-900 dark:border-purple-950">
          <span>• CS 대응팀 (김상담 선임)</span>
          <span className="font-mono text-[10px] text-emerald-600 font-bold">ONLINE</span>
        </div>
        <div className="flex items-center justify-between rounded bg-white p-2 border border-purple-100 dark:bg-zinc-900 dark:border-purple-950">
          <span>• 물류 출고팀 (이물류 주임)</span>
          <span className="font-mono text-[10px] text-emerald-600 font-bold">ONLINE</span>
        </div>
      </div>
    </div>
  )
}
