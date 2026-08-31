'use client'

import React, { useState, useOptimistic, useTransition } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { addCartItemServer, resetServerCart } from '../actions'
import type { OptimisticCartItem } from '../types'
import { VerificationFooter } from './VerificationFooter'

interface OptimisticCartClientProps {
  initialCart: OptimisticCartItem[]
}

const AVAILABLE_PRODUCTS = [
  { id: 'item-2', name: '오버핏 프리미엄 후드티', price: 69000 },
  { id: 'item-3', name: '인체공학 무선 마우스', price: 99000 },
  { id: 'item-4', name: '스테인리스 진공 텀블러', price: 25000 },
]

export function OptimisticCartClient({ initialCart }: OptimisticCartClientProps) {
  const [cart, setCart] = useState<OptimisticCartItem[]>(initialCart)
  const [isPending, startTransition] = useTransition()
  const [hasInteracted, setHasInteracted] = useState(false)
  const [log, setLog] = useState<string>('대기 중: 상품을 장바구니에 담아보세요.')

  // React 19 useOptimistic Hook
  const [optimisticCart, setOptimisticCart] = useOptimistic(
    cart,
    (state, newItem: Omit<OptimisticCartItem, 'quantity' | 'isOptimistic'>) => {
      const existing = state.find((i) => i.id === newItem.id)
      if (existing) {
        return state.map((i) =>
          i.id === newItem.id
            ? { ...i, quantity: i.quantity + 1, isOptimistic: true }
            : i,
        )
      }
      return [...state, { ...newItem, quantity: 1, isOptimistic: true }]
    },
  )

  const handleAddToCart = (product: typeof AVAILABLE_PRODUCTS[0]) => {
    setHasInteracted(true)
    setLog(`[즉각 반영] 낙관적 업데이트 발동: "${product.name}" 즉시 장바구니 추가됨 (서버 통신 800ms 대기 중...)`)

    startTransition(async () => {
      // 1. 낙관적 상태 즉시 반영
      setOptimisticCart(product)

      // 2. 실제 서버 통신 대기 (800ms 지연)
      const updatedServerCart = await addCartItemServer(product)

      // 3. 서버 응답 수신 후 실제 상태 확정
      setCart(updatedServerCart)
      setLog(`[800ms 완료] 서버 확정 완료: "${product.name}" 데이터베이스 동기화 완료!`)
    })
  }

  const handleReset = () => {
    setHasInteracted(true)
    startTransition(async () => {
      const reset = await resetServerCart()
      setCart(reset)
      setLog('장바구니가 초기 상태로 리셋되었습니다.')
    })
  }

  const totalQuantity = optimisticCart.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = optimisticCart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="낙관적 장바구니 인터랙션 시뮬레이터" className="space-y-4">
        {/* 1. 상품 선택 및 장바구니 담기 영역 */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            상품 목록 ([담기] 클릭 시 즉각 UI 반영):
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {AVAILABLE_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col justify-between rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {prod.name}
                  </div>
                  <div className="mt-0.5 font-mono text-xs text-zinc-500">
                    {prod.price.toLocaleString()}원
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddToCart(prod)}
                  disabled={isPending}
                  className="mt-3 inline-flex w-full items-center justify-center rounded bg-zinc-900 py-1.5 text-xs font-medium text-white shadow-2xs transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
                >
                  + 장바구니 담기
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 낙관적 장바구니 상태 뷰 */}
        <div className="overflow-hidden rounded-md border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                실시간 장바구니 (총 {totalQuantity}개)
              </span>
              {isPending && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                  useOptimistic 반영 중 (서버 통신 800ms)
                </span>
              )}
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              총 결제액: {totalPrice.toLocaleString()}원
            </span>
          </div>

          <ul className="divide-y divide-zinc-100 p-2 dark:divide-zinc-800">
            {optimisticCart.map((item) => (
              <li
                key={item.id}
                className={`flex items-center justify-between px-3 py-2 text-xs transition ${
                  item.isOptimistic
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200'
                    : 'text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  {item.isOptimistic && (
                    <span className="rounded bg-amber-200/80 px-1 py-0.2 font-mono text-[9px] text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      낙관적 렌더링
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-zinc-500">수량: {item.quantity}</span>
                  <span className="font-bold">
                    {(item.price * item.quantity).toLocaleString()}원
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* 하단 로그 안내 */}
          <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-2 text-[11px] font-mono text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
            • 상태 로그: <span className="text-zinc-800 dark:text-zinc-200">{log}</span>
          </div>
        </div>

        {/* 3. 초기화 버튼 */}
        <div className="flex justify-end pt-1">
          <DemoResetButton onReset={handleReset} label="장바구니 초기화" />
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter
        hasInteracted={hasInteracted}
        isPending={isPending}
        optimisticCart={optimisticCart}
        cart={cart}
      />
    </div>
  )
}
