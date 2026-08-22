'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OrderSummaryHeader } from './components/OrderSummaryHeader'
import { VerificationFooter } from './components/VerificationFooter'

export default function SegmentErrorRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="error.tsx 세그먼트 에러 바운더리 격리 & 복구"
        concept="하위 결제 세그먼트에서 치명적 예외가 발생하더라도, error.tsx가 결제 영역만 에러 UI로 격리합니다. 상위 주문서 헤더와 레이아웃은 그대로 유지되며, reset()을 통해 새로고침 없이 즉시 복구할 수 있습니다."
        steps={[
          {
            step: 1,
            title: '[결제 단계로 이동] 클릭',
            description: '주문서 화면에서 결제 세그먼트(/payment)로 이동합니다.',
            actionBadge: '세그먼트 이동',
          },
          {
            step: 2,
            title: ' 결제 통신 에러 강제 발생',
            description: '버튼을 눌러 예외를 발생시키고 payment/error.tsx만 대체 렌더링되는 것을 봅니다.',
            actionBadge: '에러 바운더리 포착',
          },
          {
            step: 3,
            title: 'reset() 복구 클릭',
            description: '[결제 다시 시도 (reset())]를 눌러 상단 헤더 소실 없이 정상 복구되는 것을 확인합니다.',
            actionBadge: '오류 복구 성공',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="주문서 작성 및 결제 세그먼트" className="space-y-4">
        {/* 상위 주문서 헤더 (에러 시에도 보존) */}
        <OrderSummaryHeader />

        {/* 하위 세그먼트 및 error.tsx 슬롯 */}
        <div className="pt-1">{children}</div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
