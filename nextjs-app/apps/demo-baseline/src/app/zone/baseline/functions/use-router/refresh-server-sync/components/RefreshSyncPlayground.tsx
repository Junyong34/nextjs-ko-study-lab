'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DemoPlaygroundCard, DemoResetButton, ProductCard, MOCK_PRODUCTS } from '@study/demo-kit'
import { restockAction, sellOneUnitAction } from '../actions'
import type { StockLogEntry } from '../types'
import { VerificationFooter } from './VerificationFooter'

const TRACKED_PRODUCT = MOCK_PRODUCTS.find((product) => product.id === 'prod-002')!

interface RefreshSyncPlaygroundProps {
  /** 이 페이지의 서버 컴포넌트가 이번 렌더링에서 실제로 읽어온 재고 값 */
  renderedStock: number
}

export function RefreshSyncPlayground({ renderedStock }: RefreshSyncPlaygroundProps) {
  const router = useRouter()
  const [trueStock, setTrueStock] = useState<number | null>(null)
  const [memo, setMemo] = useState('')
  const [log, setLog] = useState<StockLogEntry[]>([])
  const [isSelling, setIsSelling] = useState(false)

  const appendLog = (message: string) => {
    setLog((prev) => [{ id: prev.length, message, timestamp: new Date().toLocaleTimeString('ko-KR') }, ...prev].slice(0, 4))
  }

  const handleSell = async () => {
    setIsSelling(true)
    try {
      const result = await sellOneUnitAction()
      setTrueStock(result.stock)
      appendLog(`Server Action 실행 → 서버 실제 재고 ${result.stock}개로 변경 (화면은 아직 갱신 전)`)
    } finally {
      setIsSelling(false)
    }
  }

  const handleRefresh = () => {
    appendLog('router.refresh() 호출 → 서버 컴포넌트 재렌더링 요청')
    router.refresh()
  }

  const handleReset = async () => {
    const result = await restockAction()
    setTrueStock(result.stock)
    setMemo('')
    setLog([])
  }

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="상품 재고 실시간 동기화">
        <div className="space-y-4">
          <ProductCard product={{ ...TRACKED_PRODUCT, stock: renderedStock }} />

          <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 font-mono text-[11px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
            화면에 렌더링된 재고(Actual): <span className="font-bold text-zinc-900 dark:text-zinc-100">{renderedStock}개</span>
            {' · '}
            서버 실제 재고(마지막 확인값): <span className="font-bold text-zinc-900 dark:text-zinc-100">{trueStock === null ? '미확인' : `${trueStock}개`}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleSell}
              disabled={isSelling}
              className="rounded bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSelling ? '처리 중...' : '다른 사용자가 구매함 → 재고 1개 감소 (Server Action)'}
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="rounded bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 cursor-pointer"
            >
              새로고침 → router.refresh()
            </button>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="memo" className="text-[11px] font-semibold text-zinc-500">
              메모 (클라이언트 상태 — 새로고침해도 사라지지 않는지 확인)
            </label>
            <input
              id="memo"
              type="text"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              placeholder="예: 재입고 확인 완료"
              className="w-full rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          {log.length > 0 && (
            <ul className="space-y-1 rounded border border-zinc-200 bg-white p-2.5 font-mono text-[10.5px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              {log.map((entry) => (
                <li key={entry.id}>
                  [{entry.timestamp}] {entry.message}
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-end">
            <DemoResetButton onReset={handleReset} label="예제 초기화 (재고 리셋)" />
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter renderedStock={renderedStock} trueStock={trueStock} />
    </div>
  )
}
