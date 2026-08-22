"use client"
import React from "react"
import type { Order } from "./types"

interface DeliveryTrackerProps {
  order: Order
  className?: string
}

export function DeliveryTracker({ order, className = "" }: DeliveryTrackerProps) {
  const steps = [
    { key: "PAID", label: "결제 완료", stepNumber: "1" },
    { key: "PREPARING", label: "상품 준비중", stepNumber: "2" },
    { key: "SHIPPING", label: "배송 이동중", stepNumber: "3" },
    { key: "DELIVERED", label: "배송 완료", stepNumber: "4" },
  ]

  const currentIdx = steps.findIndex(s => s.key === order.status)

  return (
    <div className={`rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 ${className}`}>
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800 text-xs">
        <div>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">주문번호: </span>
          <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{order.orderNumber}</span>
        </div>
        <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {order.statusName}
        </span>
      </div>

      {/* 타임라인 바 */}
      <div className="grid grid-cols-4 gap-2 my-4">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIdx
          const isCurrent = idx === currentIdx
          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition ${
                  isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900"
                    : isDone
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                }`}
              >
                {step.stepNumber}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-medium ${
                  isCurrent
                    ? "text-blue-600 font-bold dark:text-blue-400"
                    : isDone
                    ? "text-zinc-900 dark:text-zinc-200"
                    : "text-zinc-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* 수령인 정보 */}
      <div className="rounded bg-zinc-50 p-2.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 space-y-1 font-mono">
        <div>수령인: {order.recipient.name} ({order.recipient.phone})</div>
        <div>배송지: {order.recipient.address}</div>
      </div>
    </div>
  )
}
