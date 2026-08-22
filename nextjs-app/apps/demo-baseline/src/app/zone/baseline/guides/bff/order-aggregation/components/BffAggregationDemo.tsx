'use client'
import React, { useState } from 'react'
export function BffAggregationDemo() {
  const [aggregated, setAggregated] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <button type="button" onClick={() => setAggregated(true)} className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        BFF 통합 주문 조회 API 호출 (/api/bff/order)
      </button>
      {aggregated && (
        <div className="rounded bg-zinc-900 p-3 font-mono text-xs text-emerald-400 space-y-1">
          <div>[확인] 주문 정보: Order #2026-881 (결제완료)</div>
          <div>[확인] 물류 재고: 창고 A (잔여 42개)</div>
          <div>[확인] 배송 기사: 김배송 (배정완료)</div>
        </div>
      )}
    </div>
  )
}
