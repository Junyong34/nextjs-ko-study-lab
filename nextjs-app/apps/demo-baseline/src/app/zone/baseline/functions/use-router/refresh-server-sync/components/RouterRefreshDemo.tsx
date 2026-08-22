'use client'
import React, { useState, useTransition } from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'

export function RouterRefreshDemo() {
  const [stock, setStock] = useState(MOCK_PRODUCTS[0].stock)
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date().toLocaleTimeString('ko-KR'))
  const [isPending, startTransition] = useTransition()

  const handleSimulateStockChange = () => {
    // Other client buys product
    setStock(s => Math.max(0, s - 3))
  }

  const handleRouterRefresh = () => {
    startTransition(async () => {
      await new Promise(r => setTimeout(r, 500))
      setLastRefreshedAt(new Date().toLocaleTimeString('ko-KR'))
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">router.refresh() 서버 재고 실시간 재검증 동기화</h4>
          <p className="text-zinc-500 text-[11px]">클라이언트 상태(입력값/스크롤)를 유지하면서 서버 컴포넌트 데이터만 강제 재실행합니다.</p>
        </div>
        <span className="font-mono text-zinc-500">최종 동기화: {lastRefreshedAt}</span>
      </div>

      <div className="flex items-center justify-between rounded bg-zinc-50 p-3.5 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        <div>
          <span className="text-zinc-500">상품명:</span>
          <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{MOCK_PRODUCTS[0].name}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-zinc-500">실시간 잔여 재고:</span>
            <span className={`font-mono font-extrabold text-sm ${stock <= 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {stock}개
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSimulateStockChange}
            className="rounded border border-amber-300 bg-amber-50 px-3 py-1.5 font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300 cursor-pointer"
          >
            타 고객 구매 발생 (-3개)
          </button>
          <button
            type="button"
            onClick={handleRouterRefresh}
            disabled={isPending}
            className="rounded bg-blue-600 px-3.5 py-1.5 font-bold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? '서버 동기화 중...' : 'router.refresh() 호출'}
          </button>
        </div>
      </div>
    </div>
  )
}
