'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../components/VerificationFooter'

export default function CheckoutPage() {
  const [shouldThrow, setShouldThrow] = useState(false)
  const BASE_PATH = '/zone/baseline/file-conventions/error/payment-error-boundary'

  if (shouldThrow) {
    throw new Error('PG사 결제 게이트웨이 타임아웃 (HTTP 504 Gateway Timeout)')
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="결제 세그먼트 정상 마운트 상태"
        concept="checkout/error.tsx 파일이 결제 화면 세그먼트를 감싸고 있으며, 렌더링 중 에러가 발생하면 상위 레이아웃을 파괴하지 않고 error.tsx로 대체됩니다."
        steps={[
          {
            step: 1,
            title: "결제 세그먼트 진입",
            description: "현재 checkout/page.tsx가 정상 렌더링되어 있습니다.",
            actionBadge: "정상 상태",
          },
          {
            step: 2,
            title: "결제 타임아웃 에러 트리거",
            description: "하단 버튼을 클릭하여 강제로 런타임 렌더링 에러를 발생시킵니다.",
            actionBadge: "에러 발생",
          },
          {
            step: 3,
            title: "error.tsx 바운더리 포착 및 복구",
            description: "포착된 에러 UI에서 reset()을 클릭하여 컴포넌트 트리를 복구합니다.",
            actionBadge: "복구 테스트",
          },
        ]}
      />

      <DemoPlaygroundCard title="주문 결제 진행 화면 (URL: .../checkout)">
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100">결제 수단 및 주문 상품</h5>
              <p className="text-xs text-zinc-500">신용카드 결제 및 PG사 연동 모듈이 준비되었습니다.</p>
            </div>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              ← 목록으로 복귀
            </Link>
          </div>

          <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">결제 예정 금액:</span>
              <span className="font-bold text-base text-zinc-900 dark:text-zinc-100 font-mono">149,000원</span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setShouldThrow(true)}
                className="rounded bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer transition-colors"
              >
                💥 PG 결제 타임아웃 에러 강제 발생
              </button>
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter isErrorCaught={false} />
    </DemoContainer>
  )
}
