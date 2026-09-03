import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/parallel-routes/conditional-slot/@admin')

import React from 'react'

export default function AdminSlotPage() {
  return (
    <div className="rounded-lg border-2 border-rose-500/40 bg-rose-50/30 p-4 dark:border-rose-900/50 dark:bg-rose-950/20 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500"></span>
          <h5 className="text-xs font-bold text-rose-900 dark:text-rose-200">
            @admin 슬롯 (관리자 콘솔)
          </h5>
        </div>
        <span className="rounded bg-rose-600 px-2 py-0.5 font-mono text-[9px] font-bold text-white">
          ADMIN ONLY
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="rounded bg-white p-2 border border-rose-100 dark:bg-zinc-900 dark:border-rose-950">
          <div className="text-[10px] text-zinc-400">서버 CPU 로드</div>
          <div className="font-bold text-rose-600">28.4% (안정)</div>
        </div>
        <div className="rounded bg-white p-2 border border-rose-100 dark:bg-zinc-900 dark:border-rose-950">
          <div className="text-[10px] text-zinc-400">DB 커넥션 풀</div>
          <div className="font-bold text-rose-600">42 / 100</div>
        </div>
      </div>
    </div>
  )
}
