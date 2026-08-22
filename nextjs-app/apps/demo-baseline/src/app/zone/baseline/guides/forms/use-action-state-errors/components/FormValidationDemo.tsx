'use client'

import React, { useActionState } from 'react'

interface FormState {
  success: boolean
  error?: string
  message?: string
  data?: {
    email: string
    quantity: number
  }
}

async function validateOrderFormAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Simulated server validation delay
  await new Promise((r) => setTimeout(r, 400))

  const email = formData.get('email') as string
  const quantity = Number(formData.get('quantity'))

  if (!email || !email.includes('@')) {
    return {
      success: false,
      error: '올바른 이메일 주소 형식이 아닙니다 (예: customer@example.com).',
    }
  }

  if (!quantity || quantity < 1 || quantity > 10) {
    return {
      success: false,
      error: '주문 수량은 1개 이상 10개 이하여야 합니다.',
    }
  }

  return {
    success: true,
    message: `[서버 검증 완료] ${email} 님에게 주문 확인서가 발송되었습니다.`,
    data: { email, quantity },
  }
}

const initialState: FormState = {
  success: false,
  message: '주문자 이메일과 수량을 입력하고 제출하세요.',
}

export function FormValidationDemo() {
  const [state, formAction, isPending] = useActionState(validateOrderFormAction, initialState)

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
          React 19 useActionState 폼 서버 유효성 검증 콘솔
        </h4>
        <p className="text-xs text-zinc-500">
          서버 액션 반환 상태(에러 메시지, 이전 입력값, 진행 중 상태)를 선언적으로 관리합니다.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            주문자 이메일 주소
          </label>
          <input
            type="text"
            name="email"
            defaultValue="customer@example.com"
            placeholder="name@domain.com"
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            주문 수량 (1~10개)
          </label>
          <input
            type="number"
            name="quantity"
            defaultValue={2}
            min={1}
            max={10}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        {state.error && (
          <div className="rounded bg-rose-50 p-2 text-xs font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            ⚠️ {state.error}
          </div>
        )}

        {state.success && (
          <div className="rounded bg-emerald-50 p-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            ✓ {state.message}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-900">
        <span className="text-[11px] text-zinc-400 font-mono">
          useActionState isPending: {isPending ? 'true (처리 중...)' : 'false (유휴)'}
        </span>
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
        >
          {isPending ? '서버 검증 중...' : '주문서 제출 및 검증'}
        </button>
      </div>
    </form>
  )
}
