'use client'

import React, { useState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full rounded py-2 text-xs font-bold text-white shadow-2xs transition cursor-pointer ${
        pending
          ? 'bg-amber-600 cursor-not-allowed opacity-80'
          : 'bg-emerald-600 hover:bg-emerald-700'
      }`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin">⏳</span> 결제 승인 요청 처리 중 (useFormStatus pending=true)...
        </span>
      ) : (
        '💳 189,000원 즉시 결제 승인 (useFormStatus)'
      )}
    </button>
  )
}

function FormStatusInspector() {
  const { pending, data } = useFormStatus()

  return (
    <div className="rounded bg-zinc-950 p-3 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1">
      <div className="text-zinc-400 border-b border-zinc-800 pb-1">
        하위 컴포넌트에서 감지한 useFormStatus() 상태:
      </div>
      <div className="text-[11px] space-y-0.5">
        <div>• pending: <strong className={pending ? 'text-amber-400' : 'text-emerald-400'}>{pending ? 'true' : 'false'}</strong></div>
        <div>• data: <span className="text-zinc-400">{data ? `${data.get('orderName')} (수량: ${data.get('quantity')})` : 'null (제출 전)'}</span></div>
      </div>
    </div>
  )
}

export function FormStatusDemo() {
  const [resultMessage, setResultMessage] = useState<string | null>(null)

  const handleOrderAction = async (formData: FormData) => {
    // Simulated server payment processing latency
    await new Promise((r) => setTimeout(r, 1200))
    const orderName = formData.get('orderName')
    setResultMessage(`[결제 성공] "${orderName}" 주문 번호 ORD-${Date.now().toString().slice(-6)}가 발급되었습니다.`)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
          React 19 useFormStatus 하위 버튼 상태 감지 콘솔
        </h4>
        <p className="text-xs text-zinc-500">
          부모 &lt;form&gt;의 제출 상태를 props 드릴링 없이 독립적인 하위 컴포넌트에서 훅으로 즉시 구독합니다.
        </p>
      </div>

      <form action={handleOrderAction} className="space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
          <input type="hidden" name="orderName" value="프로 무선 기계식 키보드" />
          <input type="hidden" name="quantity" value="1" />

          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">주문 품목: 프로 무선 기계식 키보드</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">189,000원</span>
          </div>

          <SubmitButton />
        </div>

        {/* useFormStatus 구독 인스펙터 */}
        <FormStatusInspector />

        {resultMessage && (
          <div className="rounded bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            ✓ {resultMessage}
          </div>
        )}
      </form>
    </div>
  )
}
