'use client'

import React, { useState, useTransition } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { updateCartQuantity, resetCart } from '../actions'
import type { CartSummary } from '../types'
import { VerificationFooter } from './VerificationFooter'

interface CartTableClientProps {
  cart: CartSummary
}

export function CartTableClient({ cart }: CartTableClientProps) {
  const [isPending, startTransition] = useTransition()
  const [actionCount, setActionCount] = useState(0)

  const handleUpdate = (id: string, delta: number) => {
    setActionCount((c) => c + 1)
    startTransition(async () => {
      await updateCartQuantity(id, delta)
    })
  }

  const handleReset = () => {
    setActionCount((c) => c + 1)
    startTransition(async () => {
      await resetCart()
    })
  }

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="이커머스 장바구니 수량 변경 및 실시간 결제액 동기화" className="space-y-4">
        {/* 1. 장바구니 테이블 */}
        <div className="overflow-hidden rounded-md border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
              <tr>
                <th className="px-3.5 py-2.5">상품명</th>
                <th className="px-3.5 py-2.5 text-right">단가</th>
                <th className="px-3.5 py-2.5 text-center">수량 조절</th>
                <th className="px-3.5 py-2.5 text-right">소계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {cart.items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-zinc-400">
                    장바구니가 비어 있습니다. 하단 [초기화]를 눌러 기본 상품을 불러오세요.
                  </td>
                </tr>
              ) : (
                cart.items.map((item) => (
                  <tr key={item.id} className="text-zinc-800 dark:text-zinc-200">
                    <td className="px-3.5 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono text-zinc-500">
                      {item.price.toLocaleString()}원
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      <div className="inline-flex items-center gap-1.5 rounded border border-zinc-200 bg-zinc-50 px-1 py-0.5 dark:border-zinc-700 dark:bg-zinc-900">
                        <button
                          type="button"
                          onClick={() => handleUpdate(item.id, -1)}
                          disabled={isPending}
                          className="h-5 w-5 rounded bg-white font-bold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer shadow-2xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdate(item.id, 1)}
                          disabled={isPending}
                          className="h-5 w-5 rounded bg-white font-bold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer shadow-2xs"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {(item.price * item.quantity).toLocaleString()}원
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 하단 합계 요약 바 */}
          <div className="flex flex-wrap items-center justify-between border-t border-zinc-200 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                총 품목: {cart.totalQuantity}개
              </span>
              <span className="font-mono text-[10px] text-zinc-400">
                (서버 동기화 시각: {cart.updatedAt})
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              <span>총 결제 예정 금액:</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {cart.totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 조작 액션 및 초기화 버튼 */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-xs text-zinc-500">
            {isPending
              ? '● Server Action 실행 및 revalidatePath 처리 중...'
              : actionCount > 0
              ? '[확인] 서버 상태 동기화 완료'
              : '수량 조절 버튼 [+] 또는 [-]를 클릭하여 Server Action을 실행하세요.'}
          </span>
          <DemoResetButton onReset={handleReset} label="장바구니 초기화" />
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter cart={cart} actionCount={actionCount} isPending={isPending} />
    </div>
  )
}
