'use client'
import React from 'react'
import type { OrderSyncResult } from '../actions'

interface ServerOnlyGuardDemoProps {
  selectedProduct: string
  orderQuantity: number
  result: OrderSyncResult | null
  isPending: boolean
  onSelectProduct: (id: string) => void
  onChangeQuantity: (delta: number) => void
  onSync: () => void
}

export function ServerOnlyGuardDemo({
  selectedProduct,
  orderQuantity,
  result,
  isPending,
  onSelectProduct,
  onChangeQuantity,
  onSync,
}: ServerOnlyGuardDemoProps) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">server-only 보호 서버 액션 실습 콘솔</h4>
          <p className="text-xs text-zinc-500">시크릿 키는 server-only 모듈(lib/orderSyncSecret.ts) 안에서만 계산되고 Server Action 응답에는 마스킹된 값만 반환됩니다.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSelectProduct('PROD-001')}
            className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${selectedProduct === 'PROD-001' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}
          >
            러닝화 (#001)
          </button>
          <button
            onClick={() => onSelectProduct('PROD-002')}
            className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${selectedProduct === 'PROD-002' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}
          >
            윈드브레이커 (#002)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">동기화 수량</span>
            <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-mono dark:bg-zinc-800">{selectedProduct}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onChangeQuantity(-1)} className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer">-</button>
            <span className="w-10 text-center font-bold font-mono">{orderQuantity}</span>
            <button onClick={() => onChangeQuantity(1)} className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer">+</button>
            <button
              onClick={onSync}
              disabled={isPending}
              className="ml-auto rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              {isPending ? '서버 액션 실행 중...' : '동작 실행'}
            </button>
          </div>
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1">
          <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">Server Action 응답 (원본 시크릿 미포함):</div>
          {result ? (
            <div className="space-y-1 pt-1 text-[11px]">
              <div className="text-emerald-400 font-bold">digest: {result.digest}</div>
              <div>secretPreview: {result.secretPreview}</div>
              <div>
                responseContainsRawSecret:{' '}
                <span className={result.responseContainsRawSecret ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {String(result.responseContainsRawSecret)}
                </span>
              </div>
              <div className="text-zinc-500">[{result.timestamp}]</div>
            </div>
          ) : (
            <div className="pt-1 text-[11px] text-zinc-500">동작 실행 전</div>
          )}
        </div>
      </div>
    </div>
  )
}
