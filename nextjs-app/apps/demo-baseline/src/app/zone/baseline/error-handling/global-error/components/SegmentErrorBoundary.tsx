'use client'

import { catchError, type ErrorInfo } from 'next/error'

interface SegmentErrorFallbackProps {
  onReset: () => void
}

function SegmentErrorFallback(
  props: SegmentErrorFallbackProps,
  { error, retry }: ErrorInfo,
) {
  const handleRetry = () => {
    props.onReset()
    retry()
  }

  const message = error instanceof Error ? error.message : String(error)

  return (
    <div className="rounded border border-rose-300 bg-rose-50 p-2 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200 space-y-1">
      <div className="font-mono font-bold text-[11px]">
        [포착] catchError() 컴포넌트 에러 바운더리 (실제 throw 캡처)
      </div>
      <p className="text-[11px] font-mono">{message}</p>
      <button
        type="button"
        onClick={handleRetry}
        className="rounded bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-700 cursor-pointer"
      >
        결제 다시 시도 (retry())
      </button>
    </div>
  )
}

/**
 * Next.js 16.3+ catchError()로 만든 컴포넌트 레벨 에러 바운더리.
 * error.tsx(세그먼트 단위)와 달리 컴포넌트 트리 어디서든 감쌀 수 있어,
 * 별도 라우트 이동 없이 이 데모 안에서 실제 throw를 캡처하는 데 사용한다.
 */
export const SegmentErrorBoundary = catchError(SegmentErrorFallback)
