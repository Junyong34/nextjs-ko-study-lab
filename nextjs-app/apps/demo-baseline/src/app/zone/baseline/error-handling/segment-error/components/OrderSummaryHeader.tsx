'use client'

import React from 'react'

export function OrderSummaryHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-200 bg-zinc-900 p-3.5 text-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2 text-xs">
        <span className="font-mono font-bold text-emerald-400">주문서 #ORD-2026-9912</span>
        <span className="text-zinc-400">|</span>
        <span>주문자: 홍길동 고객님</span>
        <span className="text-zinc-400">|</span>
        <span className="font-mono font-bold">결제 금액: 208,000원</span>
      </div>

      <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300 border border-zinc-700">
        상위 레이아웃: 에러 발생 시에도 정상 보존됨
      </span>
    </div>
  )
}
