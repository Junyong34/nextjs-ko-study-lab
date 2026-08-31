'use client'

import React, { useEffect } from 'react'
import { usePaymentFlow } from '../components/context'

export default function PaymentSegmentErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { setStage, setErrorMsg } = usePaymentFlow()

  useEffect(() => {
    // 실무: Sentry, Datadog 등 에러 모니터링 시스템으로 전송
    console.error('PaymentSegment Error Caught:', error)
    setStage('errored')
    setErrorMsg(error.message || 'PG사 결제 게이트웨이 연결 실패 (504 Gateway Timeout)')
  }, [error, setStage, setErrorMsg])

  const handleReset = () => {
    setStage('recovered')
    setErrorMsg(null)
    reset()
  }

  return (
    <div className="space-y-3 rounded-md border border-rose-300 bg-rose-50/60 p-4 dark:border-rose-900/60 dark:bg-rose-950/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
            [주의] 결제 모듈 통신 에러 발생
          </span>
          <span className="rounded bg-rose-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-900 dark:bg-rose-900 dark:text-rose-200">
            payment/error.tsx 포착 완료
          </span>
        </div>
      </div>

      <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed font-mono">
        에러 사유: {error.message || 'PG 결제 승인 서버 응답 시간 초과 (504 Gateway Timeout)'}
      </p>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs transition hover:bg-rose-700 cursor-pointer"
        >
          <span>결제 다시 시도 (reset())</span>
        </button>

        <a
          href="/zone/baseline/error-handling/segment-error"
          className="inline-flex items-center rounded border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:bg-zinc-900 dark:text-rose-300 cursor-pointer"
        >
          주문서 메인으로 복귀
        </a>
      </div>
    </div>
  )
}
