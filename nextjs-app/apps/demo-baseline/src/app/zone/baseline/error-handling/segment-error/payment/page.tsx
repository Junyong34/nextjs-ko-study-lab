'use client'

import React, { useState, useEffect } from 'react'
import { usePaymentFlow } from '../components/context'

export default function PaymentPage() {
  const [shouldError, setShouldError] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pay' | 'transfer'>('card')
  const { stage, setStage } = usePaymentFlow()

  useEffect(() => {
    if (stage !== 'recovered' && stage !== 'completed') {
      setStage('payment_ready')
    }
  }, [stage, setStage])

  if (shouldError) {
    throw new Error('PG사 결제 게이트웨이 연결 실패 (504 Gateway Timeout)')
  }

  const handleCompletePayment = () => {
    setStage('completed')
    alert('정상 결제가 완료되었습니다!')
  }

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          결제 수단 선택 및 승인 (URL: /payment)
        </h4>
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {stage === 'recovered' ? '에러 복구 완료' : stage === 'completed' ? '결제 완료' : '정상 결제 세그먼트'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {(['card', 'pay', 'transfer'] as const).map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => setPaymentMethod(method)}
            className={`rounded px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
              paymentMethod === method
                ? 'bg-zinc-900 text-white font-bold dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            {method === 'card' && '신용/체크카드'}
            {method === 'pay' && '간편결제 (카카오/네이버페이)'}
            {method === 'transfer' && '실시간 계좌이체'}
          </button>
        ))}
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCompletePayment}
          className="rounded bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-2xs hover:bg-emerald-700 cursor-pointer"
        >
          208,000원 결제 완료하기
        </button>

        {/* 의도적 에러 발생 버튼 */}
        <button
          type="button"
          onClick={() => setShouldError(true)}
          className="rounded border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 cursor-pointer"
        >
           결제 통신 에러 강제 발생 (error.tsx 테스트)
        </button>
      </div>
    </div>
  )
}
