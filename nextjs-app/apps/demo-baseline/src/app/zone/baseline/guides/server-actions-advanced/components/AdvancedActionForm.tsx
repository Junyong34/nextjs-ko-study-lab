'use client'

import React, { useActionState } from 'react'
import { applyCouponAction } from '../actions'
import type { CouponState } from '../types'
import { VerificationFooter } from './VerificationFooter'

const initialState: CouponState = {
  success: false,
  message: '',
}

export function AdvancedActionForm() {
  const [state, formAction, isPending] = useActionState(
    applyCouponAction,
    initialState,
  )

  const originalPrice = 219000
  const finalPrice =
    state.success && state.discountAmount
      ? Math.max(0, originalPrice - state.discountAmount)
      : originalPrice

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* 1. 결제 금액 계산 요약 카드 */}
        <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
            <span>주문 금액</span>
            <span className="font-mono">{originalPrice.toLocaleString()}원</span>
          </div>

          {state.success && state.discountAmount && (
            <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-semibold">
              <span>쿠폰 할인 ({state.appliedCode})</span>
              <span className="font-mono">-{state.discountAmount.toLocaleString()}원</span>
            </div>
          )}

          <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800 flex items-center justify-between font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
            <span>최종 결제 금액</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {finalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 2. Server Action 폼 */}
        <form
          action={formAction}
          className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              프로모션 쿠폰 코드 입력 (예: NEXTJS16, VIPSTUDY, WELCOME2026)
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                name="couponCode"
                placeholder="쿠폰 코드를 입력하세요"
                defaultValue="NEXTJS16"
                className="flex-1 rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <button
                type="submit"
                disabled={isPending}
                className="rounded bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
              >
                {isPending ? '검증 중...' : '쿠폰 적용'}
              </button>
            </div>
          </div>

          {state.message && (
            <div
              className={`rounded p-2.5 text-xs font-mono ${
                state.success
                  ? 'border border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'border border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
              }`}
            >
              {state.message}
            </div>
          )}
        </form>
      </div>

      {/* 3단 & 4단 검증 패널 및 개념 정리 */}
      <VerificationFooter
        state={state}
        originalPrice={originalPrice}
        finalPrice={finalPrice}
        isPending={isPending}
      />
    </div>
  )
}
