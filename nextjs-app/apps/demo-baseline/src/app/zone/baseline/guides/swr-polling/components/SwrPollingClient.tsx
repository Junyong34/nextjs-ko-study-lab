'use client'
import React, { useState, useEffect } from 'react'
import { MOCK_ORDERS, DeliveryTracker, type Order } from '@study/demo-kit'

export function SwrPollingClient() {
  const [order, setOrder] = useState<Order>(MOCK_ORDERS[0])
  const [pollCount, setPollCount] = useState(1)
  const [isPolling, setIsPolling] = useState(true)

  useEffect(() => {
    if (!isPolling) return
    const interval = setInterval(() => {
      setPollCount(c => c + 1)
      // simulate status transition after some polls
      setOrder(prev => {
        if (prev.status === 'PAID') return { ...prev, status: 'PREPARING', statusName: '상품 준비중' }
        if (prev.status === 'PREPARING') return { ...prev, status: 'SHIPPING', statusName: '배송 중' }
        return prev
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [isPolling])

  const handleManualMutate = (newStatus: Order['status'], name: string) => {
    setOrder(prev => ({ ...prev, status: newStatus, statusName: name }))
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">SWR 실시간 주문/배송 위치 자동 폴링 (useSWR Polling)</h4>
          <p className="text-zinc-500 text-[11px]">3초 주기로 배송 API를 자동 폴링하며, mutate()로 즉각적인 상태 갱신을 실행합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-500">폴링 횟수: {pollCount}회</span>
          <button
            type="button"
            onClick={() => setIsPolling(!isPolling)}
            className={`rounded px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
              isPolling ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-zinc-200 text-zinc-700'
            }`}
          >
            {isPolling ? '- 자동 폴링 중' : '일시정지'}
          </button>
        </div>
      </div>

      <DeliveryTracker order={order} />

      <div className="flex items-center justify-between rounded bg-zinc-50 p-2.5 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        <span className="text-zinc-500 font-medium">SWR mutate() 강제 상태 변경:</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => handleManualMutate('SHIPPING', '배송 중')}
            className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            배송 출발
          </button>
          <button
            type="button"
            onClick={() => handleManualMutate('DELIVERED', '배송 완료')}
            className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 cursor-pointer"
          >
            배송 완료 (mutate)
          </button>
        </div>
      </div>
    </div>
  )
}
