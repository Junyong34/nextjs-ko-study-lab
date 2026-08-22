'use client'

import React, { useState } from 'react'

export function StatePreservingCounter() {
  const [count, setCount] = useState(10)
  const [inputValue, setInputValue] = useState('장바구니 메모: 빠른 배송 부탁드립니다.')
  const [mountTime] = useState(() => new Date().toLocaleTimeString('ko-KR'))

  return (
    <div className="space-y-4">
      {/* 1. 상태 보존 인터랙션 뷰 */}
      <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              React Fast Refresh 상태 보존 컨테이너
            </span>
            <span className="rounded bg-emerald-100 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              HMR Active
            </span>
          </div>

          <span className="font-mono text-[11px] text-zinc-400">
            초기 마운트: {mountTime}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          {/* 수량 상태 카운터 */}
          <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              useState 수량 상태: <strong className="font-mono text-zinc-900 dark:text-zinc-100">{count}개</strong>
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setCount((c) => c + 1)}
                className="rounded bg-zinc-900 px-3 py-1 font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
              >
                +1 증가
              </button>
              <button
                type="button"
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                className="rounded border border-zinc-300 bg-white px-3 py-1 font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
              >
                -1 감소
              </button>
            </div>
          </div>

          {/* 인풋 입력 상태 */}
          <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              폼 입력 상태 (텍스트 유지):
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
