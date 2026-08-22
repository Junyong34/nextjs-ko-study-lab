'use client'

import React, { useState, useTransition } from 'react'

export function SwrMutationDemo() {
  const [qty, setQty] = useState(2)
  const unitPrice = 349000
  const [isUpdating, setIsUpdating] = useState(false)
  const [simulateFail, setSimulateFail] = useState(false)
  const [logs, setLogs] = useState<string[]>([
    'SWR 키: ["/api/cart", "usr_guest123"] 캐시 동기화 완료',
  ])

  const handleOptimisticUpdate = async (delta: number) => {
    const prevQty = qty
    const nextQty = Math.max(1, qty + delta)

    // 1. Optimistic local cache mutation (0ms)
    setQty(nextQty)
    setIsUpdating(true)
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] mutate() 낙관적 즉각 반영: 수량 ${prevQty}개 -> ${nextQty}개 (UI 즉각 갱신)`,
      ...prev.slice(0, 4),
    ])

    // 2. Simulated server mutation
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (simulateFail) reject(new Error('서버 DB 트랜잭션 충돌 / 네트워크 타임아웃'))
          else resolve({ success: true, newQty: nextQty })
        }, 600)
      })
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] 서버 동기화 완료: DB 재고 차감 확정 (200 OK)`,
        ...prev.slice(0, 4),
      ])
    } catch (err: any) {
      // 3. Rollback on failure
      setQty(prevQty)
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] ⚠️ 서버 오류 발생: ${err.message} -> 이전 상태 (${prevQty}개)로 자동 롤백`,
        ...prev.slice(0, 4),
      ])
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 헤더 및 제어 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
            SWR mutate() 낙관적 UI 업데이트 (Optimistic UI & Rollback)
          </h4>
          <p className="text-xs text-zinc-500">
            서버 응답을 기다리지 않고 로컬 SWR 캐시를 즉시 갱신하며, 서버 실패 시 rollbackOnError로 복원합니다.
          </p>
        </div>

        <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={simulateFail}
            onChange={(e) => setSimulateFail(e.target.checked)}
            className="rounded border-zinc-300"
          />
          <span className={simulateFail ? 'text-rose-600 font-bold' : ''}>
            서버 에러 강제 발생 (롤백 테스트)
          </span>
        </label>
      </div>

      {/* 2. 장바구니 품목 카드 */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              노이즈 캔슬링 프리미엄 블루투스 헤드폰
            </div>
            <div className="text-[11px] text-zinc-500">
              단가: {unitPrice.toLocaleString()}원 / SWR 낙관적 동기화
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-400">총 결제 금액</div>
            <div className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
              {(qty * unitPrice).toLocaleString()}원
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOptimisticUpdate(-1)}
              disabled={isUpdating || qty <= 1}
              className="rounded border border-zinc-300 bg-white px-3 py-1 text-xs font-bold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
            >
              -1 감소
            </button>
            <span className="w-12 text-center font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {qty}개
            </span>
            <button
              type="button"
              onClick={() => handleOptimisticUpdate(1)}
              disabled={isUpdating}
              className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              +1 증가 (mutate 즉시 반영)
            </button>
          </div>

          <span
            className={`font-mono text-[11px] font-bold ${
              isUpdating ? 'text-amber-600 animate-pulse' : 'text-emerald-600'
            }`}
          >
            {isUpdating ? '⏳ 서버 백그라운드 동기화 중...' : '✓ SWR 캐시 일치'}
          </span>
        </div>
      </div>

      {/* 3. SWR mutate 실행 시그니처 & 로그 */}
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
          SWR mutate() 시그니처 및 동기화 로그:
        </div>
        <div className="text-blue-300 text-[11px]">
          mutate('/api/cart', updateCart(quantity), {'{'} optimisticData: {'{'} quantity: {qty} {'}'}, rollbackOnError: true, revalidate: true {'}'})
        </div>
        <div className="space-y-1 text-[11px] pt-1">
          {logs.map((log, i) => (
            <div
              key={i}
              className={i === 0 ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
