'use client'
import React from 'react'
import type { Order } from '../types'

interface OrderConsolePanelProps {
  orders: Order[]
  actionLog: string[]
  pendingCreatedOrderId: string | null
}

/** GET 응답을 그대로 보여주는 콘솔형 패널 — POST 직후에도 여기 목록은 바뀌지 않는다. */
export function OrderConsolePanel({ orders, actionLog, pendingCreatedOrderId }: OrderConsolePanelProps) {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
        <span className="font-bold text-zinc-400">GET 응답 / 주문 목록:</span>
        <span className="text-[10px] text-zinc-500">총 {orders.length}건</span>
      </div>
      <div className="space-y-1 max-h-28 overflow-y-auto pt-1 text-[11px]">
        {orders.slice(0, 3).map((ord) => (
          <div
            key={ord.id}
            className={`flex justify-between border-b border-zinc-900 py-0.5 ${
              ord.id === pendingCreatedOrderId ? 'text-emerald-400' : 'text-zinc-400'
            }`}
          >
            <span className={ord.id === pendingCreatedOrderId ? 'text-emerald-400' : 'text-emerald-500'}>{ord.id}</span>
            <span>{ord.productName} x {ord.quantity}</span>
            <span className="text-zinc-500">{ord.total.toLocaleString()}원</span>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-800 pt-1 space-y-1 text-[10px]">
        {actionLog.slice(0, 2).map((log, i) => (
          <div key={i} className={i === 0 ? 'text-amber-400' : 'text-zinc-500'}>
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}
