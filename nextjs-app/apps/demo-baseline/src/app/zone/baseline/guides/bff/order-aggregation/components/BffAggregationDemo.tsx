'use client'
import React, { useState } from 'react'

interface AggregatedResult {
  order: { orderId: string; status: string }
  inventory: { warehouse: string; remaining: number }
  shipping: { courier: string; status: string }
  elapsedMs: number
}

interface BffAggregationDemoProps {
  onResult: (result: AggregatedResult) => void
}

export function BffAggregationDemo({ onResult }: BffAggregationDemoProps) {
  const [data, setData] = useState<AggregatedResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCall = async () => {
    setIsLoading(true)
    const res = await fetch('/zone/baseline/guides/bff/order-aggregation/api/order')
    const json: AggregatedResult = await res.json()
    setData(json)
    onResult(json)
    setIsLoading(false)
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <button
        type="button"
        onClick={handleCall}
        disabled={isLoading}
        className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? '호출 중...' : 'BFF 통합 주문 조회 API 호출 (/api/bff/order)'}
      </button>
      {data && (
        <div className="rounded bg-zinc-900 p-3 font-mono text-xs text-emerald-400 space-y-1">
          <div>[확인] 주문 정보: {data.order.orderId} ({data.order.status})</div>
          <div>[확인] 물류 재고: {data.inventory.warehouse} (잔여 {data.inventory.remaining}개)</div>
          <div>[확인] 배송 기사: {data.shipping.courier} ({data.shipping.status})</div>
          <div className="text-zinc-500 pt-1">서버 측 Promise.all 소요 시간: {data.elapsedMs}ms (실측)</div>
        </div>
      )}
    </div>
  )
}
