'use client'

import React, { useActionState, useState } from 'react'
import { submitOrderAction } from '../actions'
import type { FormState } from '../types'
import { VerificationFooter } from './VerificationFooter'

const initialFormState: FormState = {
  success: false,
  message: '',
}

export function ErrorLayerSimulator() {
  const [state, formAction, isPending] = useActionState(
    submitOrderAction,
    initialFormState,
  )
  const [segmentSimulated, setSegmentSimulated] = useState(false)
  const [segmentActive, setSegmentActive] = useState(false)
  const [globalSimulated, setGlobalSimulated] = useState(false)
  const [globalModalOpen, setGlobalModalOpen] = useState(false)

  const handleTriggerSegment = () => {
    setSegmentSimulated(true)
    setSegmentActive(true)
  }

  const handleResetSegment = () => {
    setSegmentActive(false)
  }

  const handleTriggerGlobal = () => {
    setGlobalSimulated(true)
    setGlobalModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* 1. useActionState 예상된 에러(Expected Error) 폼 테스트 */}
      <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            1. 예상된 에러(Expected Errors) 처리 — useActionState (400)
          </span>
          <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            throw 없이 상태 객체 모델링
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

      {/* 2 & 3. 3대 계층 에러 시뮬레이션 인터랙티브 카드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
        {/* Tier 1 Info */}
        <div className="rounded border border-blue-200 bg-blue-50/30 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20 space-y-2 flex flex-col justify-between">
          <div>
            <span className="font-bold text-blue-900 dark:text-blue-200">
              1. 예상된 에러 (Expected)
            </span>
            <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
              폼 유효성 실패. <code>useActionState</code>로 throw 없이 인라인 필드 에러 반환.
            </p>
          </div>
          <div className="text-[10px] font-mono text-blue-700 dark:text-blue-300">
            상태: {state.message ? '검증 실행됨' : '입력 대기 중'}
          </div>
        </div>

        {/* Tier 2 Interactive Simulator */}
        <div className="rounded border border-amber-200 bg-amber-50/30 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-2 flex flex-col justify-between">
          <div>
            <span className="font-bold text-amber-900 dark:text-amber-200">
              2. 세그먼트 예외 (error.tsx)
            </span>
            <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
              하위 세그먼트 예외 발생 시 상위 레이아웃을 보존하며 <code>error.tsx</code>로 격리.
            </p>
          </div>

          {segmentActive ? (
            <div className="rounded border border-rose-300 bg-rose-50 p-2 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200 space-y-1">
              <div className="font-mono font-bold text-[11px]">
                [포착] payment/error.tsx
              </div>
              <button
                type="button"
                onClick={handleResetSegment}
                className="rounded bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-700 cursor-pointer"
              >
                결제 다시 시도 (reset())
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleTriggerSegment}
              className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-amber-700 cursor-pointer"
            >
              2. 세그먼트 예외 던지기 시뮬레이션
            </button>
          )}
        </div>

        {/* Tier 3 Interactive Simulator */}
        <div className="rounded border border-rose-200 bg-rose-50/30 p-3.5 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-2 flex flex-col justify-between">
          <div>
            <span className="font-bold text-rose-900 dark:text-rose-200">
              3. 루트 크래시 (global-error)
            </span>
            <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
              Root Layout 크래시 시 <code>global-error.tsx</code> + <code>{'<'}html{'>'}{'<'}body{'>'}</code> 비상 화면.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTriggerGlobal}
            className="rounded bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-rose-700 cursor-pointer"
          >
            3. 루트 레이아웃 크래시 시뮬레이션
          </button>
        </div>
      </div>

      {/* Global Error Fullscreen Modal Simulator */}
      {globalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-md w-full rounded-lg border border-zinc-700 bg-zinc-950 p-6 text-white shadow-2xl space-y-4">
            <div className="space-y-1">
              <span className="rounded bg-rose-600 px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                global-error.tsx (Root Layout Crash)
              </span>
              <h3 className="text-base font-bold text-rose-400">
                치명적 전역 에러가 발생했습니다
              </h3>
              <p className="text-xs text-zinc-400">
                최상위 루트 레이아웃(app/layout.tsx) 크래시로 인해 global-error.tsx의 독립 &lt;html&gt;&lt;body&gt; 태그가 렌더링되었습니다.
              </p>
            </div>
            <div className="rounded bg-zinc-900 p-3 font-mono text-[11px] text-zinc-400">
              Digest: ERR_ROOT_LAYOUT_CRASH_0x9A
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setGlobalModalOpen(false)}
                className="rounded bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-900 hover:bg-white cursor-pointer"
              >
                서비스 복구 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter
        state={state}
        segmentSimulated={segmentSimulated}
        globalSimulated={globalSimulated}
      />
    </div>
  )
}
