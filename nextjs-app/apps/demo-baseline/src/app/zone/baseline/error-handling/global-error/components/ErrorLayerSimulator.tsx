'use client'

import React, { useActionState } from 'react'
import { submitOrderAction } from '../actions'
import type { FormState } from '../types'

const initialFormState: FormState = {
  success: false,
  message: '',
}

export function ErrorLayerSimulator() {
  const [state, formAction, isPending] = useActionState(
    submitOrderAction,
    initialFormState,
  )

  return (
    <div className="space-y-4">
      {/* 1. useActionState 예상된 에러(Expected Error) 폼 테스트 */}
      <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            1. 예상된 에러(Expected Errors) 처리 — useActionState
          </span>
          <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            throw 없이 값으로 모델링
          </span>
        </div>

        <form action={formAction} className="space-y-2.5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                주문자 이메일
              </label>
              <input
                type="text"
                name="email"
                placeholder="잘못된 이메일 (예: invalid-email)"
                defaultValue="invalid-email"
                className="mt-1 w-full rounded border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              {state.fieldErrors?.email && (
                <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
                  {state.fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                주문 금액 (원)
              </label>
              <input
                type="number"
                name="amount"
                placeholder="0"
                defaultValue="0"
                className="mt-1 w-full rounded border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              {state.fieldErrors?.amount && (
                <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
                  {state.fieldErrors.amount}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              {isPending ? '검증 중...' : '주문 제출 (유효성 검사 테스트)'}
            </button>

            {state.message && (
              <span
                className={`font-mono text-xs ${
                  state.success
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {state.message}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 2. 에러 3대 계층 구조 안내 카드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded border border-blue-200 bg-blue-50/30 p-3 dark:border-blue-900/40 dark:bg-blue-950/20 space-y-1">
          <span className="font-bold text-blue-900 dark:text-blue-200">
            1. 예상된 에러 (Expected)
          </span>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
            폼 검증, 비즈니스 실패. <br />
            <code>useActionState</code>로 값 반환.
          </p>
        </div>

        <div className="rounded border border-amber-200 bg-amber-50/30 p-3 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-1">
          <span className="font-bold text-amber-900 dark:text-amber-200">
            2. 세그먼트 예외 (Uncaught)
          </span>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
            하위 페이지 렌더/통신 실패. <br />
            <code>error.tsx</code>로 부분 격리.
          </p>
        </div>

        <div className="rounded border border-rose-200 bg-rose-50/30 p-3 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-1">
          <span className="font-bold text-rose-900 dark:text-rose-200">
            3. 전역 에러 (Global Error)
          </span>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
            루트 레이아웃 자체 크래시. <br />
            <code>global-error.tsx</code> + <code>{'<'}html{'>'}</code>.
          </p>
        </div>
      </div>
    </div>
  )
}
