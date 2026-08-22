'use client'
import React, { useState } from 'react'

export function RouterCacheBackDemo() {
  const [selectedProduct, setSelectedProduct] = useState('PROD-001')
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [actionLog, setActionLog] = useState<string[]>([
    '쇼핑몰 세션 초기화: 장바구니 활성화됨 (KRW)'
  ])

  const addLog = (msg: string) => {
    setActionLog(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 4)
    ])
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Router Cache를 통한 뒤로가기 0ms 즉각 복구 실습 콘솔</h4>
          <p className="text-xs text-zinc-500">이커머스 비즈니스 규칙과 Next.js 런타임 상호작용을 제어합니다.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedProduct('PROD-001')
              addLog('상품 선택: 프리미엄 러닝화 (KRW 129,000)')
            }}
            className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              selectedProduct === 'PROD-001' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            러닝화 (#001)
          </button>
          <button
            onClick={() => {
              setSelectedProduct('PROD-002')
              addLog('상품 선택: 방수 윈드브레이커 (KRW 189,000)')
            }}
            className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              selectedProduct === 'PROD-002' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            윈드브레이커 (#002)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">주문 옵션 및 수량</span>
            <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-mono dark:bg-zinc-800">{selectedProduct}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (orderQuantity > 1) {
                  setOrderQuantity(q => q - 1)
                  addLog(`수량 감소: ${orderQuantity - 1}개`)
                }
              }}
              className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
            >
              -
            </button>
            <span className="w-10 text-center font-bold font-mono">{orderQuantity}</span>
            <button
              onClick={() => {
                setOrderQuantity(q => q + 1)
                addLog(`수량 증가: ${orderQuantity + 1}개`)
              }}
              className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
            >
              +
            </button>
            <button
              onClick={() => addLog(`Next.js API 트리거: ${selectedProduct} x ${orderQuantity}건 동기화 성공`)}
              className="ml-auto rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              동작 실행
            </button>
          </div>
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1">
          <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">실시간 도메인 로그:</div>
          <div className="space-y-1 pt-1 text-[11px]">
            {actionLog.map((log, i) => (
              <div key={i} className={i === 0 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
