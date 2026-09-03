import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/parallel-routes/conditional-slot/@user')

import React from 'react'

export default function UserSlotPage() {
  return (
    <div className="rounded-lg border-2 border-emerald-500/40 bg-emerald-50/30 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
            @user 슬롯 (일반 회원 마이페이지)
          </h5>
        </div>
        <span className="rounded bg-emerald-600 px-2 py-0.5 font-mono text-[9px] font-bold text-white">
          MEMBER VIEW
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="rounded bg-white p-2 border border-emerald-100 dark:bg-zinc-900 dark:border-emerald-950">
          <div className="text-[10px] text-zinc-400">보유 포인트 / 쿠폰</div>
          <div className="font-bold text-emerald-600">15,400 P (3장)</div>
        </div>
        <div className="rounded bg-white p-2 border border-emerald-100 dark:bg-zinc-900 dark:border-emerald-950">
          <div className="text-[10px] text-zinc-400">최근 배송 현황</div>
          <div className="font-bold text-emerald-600">배송 중 1건</div>
        </div>
      </div>
    </div>
  )
}
