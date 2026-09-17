'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { DemoContainer, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../components/VerificationFooter'

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로깅 서비스 전송
    console.error('결제 세그먼트 에러 포착:', error)
  }, [error])

  const BASE_PATH = '/zone/baseline/file-conventions/error/payment-error-boundary'

  return (
    <DemoContainer className="space-y-6">
      <DemoPlaygroundCard title="주문 결제 진행 화면 (URL: .../checkout) — error.tsx 활성화">
        <div className="space-y-4 rounded-lg border-2 border-rose-500/40 bg-rose-50/40 p-6 dark:border-rose-900/50 dark:bg-rose-950/20">
          <div className="flex items-center justify-between border-b border-rose-200 pb-3 dark:border-rose-900">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping"></span>
              <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">
                결제 에러 바운더리 포착 (checkout/error.tsx)
              </h4>
            </div>
            <span className="rounded bg-rose-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              ERROR BOUNDARY
            </span>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-xs text-rose-800 dark:text-rose-300">
              에러 메시지: {error.message || '결제 처리 중 예상치 못한 오류가 발생했습니다.'}
            </div>
            {error.digest && (
              <div className="font-mono text-[11px] text-rose-600 dark:text-rose-400">
                에러 다이제스트: {error.digest}
              </div>
            )}
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <code>checkout/page.tsx</code>가 렌더링 중 던진 예외가 이 <code>error.tsx</code> 바운더리에만 격리되었습니다.
              상단의 <code>checkout/layout.tsx</code> 진행 배너는 <code>error.tsx</code> 바운더리 밖에 있어 리마운트되지 않고
              그대로 남아 있습니다 — 위 배너의 마운트 ID를 에러 발생 전과 대조해 보세요.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-200 dark:border-rose-900">
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300"
            >
              장바구니 홈으로 복귀
            </Link>
            <button
              onClick={() => reset()}
              className="rounded bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer transition-colors"
            >
              다시 시도 (reset() 실행)
            </button>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter isErrorCaught={true} />
    </DemoContainer>
  )
}
