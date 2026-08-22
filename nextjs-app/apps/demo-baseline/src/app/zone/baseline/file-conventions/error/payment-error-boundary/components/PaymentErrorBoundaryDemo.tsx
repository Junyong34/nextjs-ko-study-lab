'use client'
import React, { useState } from 'react'
export function PaymentErrorBoundaryDemo() {
  const [hasError, setHasError] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">상위 주문 레이아웃 (정상 유지)</span>
        <button type="button" onClick={() => setHasError(e => !e)} className="rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">
          {hasError ? '에러 복구' : '결제 PG 연동 예외 발생'}
        </button>
      </div>
      {hasError ? (
        <div className="rounded border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          [주의]️ 결제 처리 중 일시적 오류가 발생했습니다. (payment/error.tsx 격리됨)
        </div>
      ) : (
        <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900">결제 컴포넌트 정상 가동 중</div>
      )}
    </div>
  )
}
