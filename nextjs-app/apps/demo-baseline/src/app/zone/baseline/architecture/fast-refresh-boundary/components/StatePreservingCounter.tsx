'use client'

import React, { useEffect, useState } from 'react'

export function CartItemStepper() {
  const [quantity, setQuantity] = useState(2)
  const unitPrice = 129000
  const [orderMemo, setOrderMemo] = useState('배송 전 경비실에 보관해 주세요.')
  const [mountTimestamp, setMountTimestamp] = useState<string | null>(null)
  const [lastSimulatedAt, setLastSimulatedAt] = useState<string | null>(null)

  useEffect(() => {
    setMountTimestamp(new Date().toLocaleTimeString('ko-KR'))
  }, [])

  const subtotal = quantity * unitPrice

  const handleSimulateSimilarSituation = () => {
    setLastSimulatedAt(new Date().toLocaleTimeString('ko-KR'))
  }

  const handleReset = () => {
    setQuantity(1)
    setOrderMemo('')
  }

  return (
    <div className="space-y-4">
      {/* 1. 상태 보존 인터랙션 뷰 */}
      <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              React Fast Refresh 장바구니 상태 보존 컨테이너
            </span>
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              유사 상황 시뮬레이션
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <span>초기 마운트 시각: <strong className="text-zinc-800 dark:text-zinc-200">{mountTimestamp ?? '마운트 중...'}</strong></span>
            {lastSimulatedAt && (
              <span className="text-blue-600 dark:text-blue-400 font-semibold">(시뮬레이션 반영: {lastSimulatedAt})</span>
            )}
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          실제 Fast Refresh는 <code>next dev</code> 환경에서 코드를 수정할 때만 발생하며, 배포된 이 화면에서는 재현할 수 없습니다. 아래 버튼은 "코드가 수정돼도 상태가 유지되는" 비슷한 상황을 만든 시뮬레이션입니다.
        </p>

        {/* 장바구니 품목 정보 */}
        <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              인체공학 무선 버티컬 마우스 (손목보호)
            </div>
            <div className="text-[11px] text-zinc-500">
              단가: {unitPrice.toLocaleString()}원 / 무료배송
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-400">총 결제 예정 금액</div>
            <div className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
              {subtotal.toLocaleString()}원
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          {/* 수량 상태 카운터 */}
          <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                주문 수량 (useState):
              </span>
              <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {quantity}개
              </span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex-1 rounded bg-zinc-900 py-1.5 font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer text-center text-xs"
              >
                +1 수량 증가
              </button>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex-1 rounded border border-zinc-300 bg-white py-1.5 font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer text-center text-xs"
              >
                -1 수량 감소
              </button>
            </div>
          </div>

          {/* 배송 메모 입력 상태 */}
          <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              배송 요청사항 (폼 입력 상태 유지):
            </span>
            <input
              type="text"
              value={orderMemo}
              onChange={(e) => setOrderMemo(e.target.value)}
              placeholder="배송 요청사항을 입력하세요"
              className="w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* 제어 툴바 */}
        <div className="flex items-center justify-between border-t border-zinc-200/60 pt-3 dark:border-zinc-800 text-xs">
          <button
            type="button"
            onClick={handleSimulateSimilarSituation}
            className="rounded bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700 cursor-pointer"
          >
            🔄 비슷한 상황 시뮬레이션 (실제 HMR 아님)
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline cursor-pointer"
          >
            상태 초기화
          </button>
        </div>
      </div>
    </div>
  )
}

// Alias for backwards compatibility
export const StatePreservingCounter = CartItemStepper
