'use client'
import React from 'react'
import Link from 'next/link'

export function PaymentErrorBoundaryDemo() {
  const BASE_PATH = '/zone/baseline/file-conventions/error/payment-error-boundary'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">결제 세그먼트 error.tsx 에러 바운더리</h4>
            <span className="rounded bg-rose-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              checkout/error.tsx 구축 완료
            </span>
          </div>
          <p className="text-xs text-zinc-500">결제 단계에서 발생하는 런타임 에러를 격리하여 애플리케이션 충돌을 방지합니다.</p>
        </div>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
        <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          결제 진행 및 에러 바운더리 테스트
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          아래 버튼을 눌러 <code>/checkout</code> 서브 라우트로 진입한 후, 에러 트리거 버튼을 클릭하여 <code>checkout/error.tsx</code> 바운더리가 에러를 가로채고 복구(reset)하는 과정을 실습하세요.
        </p>
        <div className="pt-2 flex justify-end">
          <Link
            href={`${BASE_PATH}/checkout`}
            className="rounded bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors"
          >
            결제 화면(checkout) 진입하기 →
          </Link>
        </div>
      </div>
    </div>
  )
}
