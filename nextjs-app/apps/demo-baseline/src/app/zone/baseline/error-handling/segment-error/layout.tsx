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
        title="Next.js error.tsx 세그먼트 에러 격리 & reset() 복구"
        concept="하위 결제 세그먼트(/payment)에서 504 Gateway Timeout 예외가 발생해도 error.tsx가 결제 영역만 에러 UI로 격리하며, 상위 주문서 헤더는 유지된 채 reset()으로 페이지 새로고침 없이 즉시 복구합니다."
        steps={[
          {
            step: 1,
            title: '[최종 결제 단계로 이동 (/payment) →] 클릭',
            description: '주문서 화면에서 결제 세그먼트 [최종 결제 단계로 이동 (/payment) →] 링크를 클릭하여 이동합니다.',
            actionBadge: '세그먼트 이동',
          },
          {
            step: 2,
            title: '[ 결제 통신 에러 강제 발생 (error.tsx 테스트)] 클릭',
            description: '버튼을 클릭하여 의도적 504 Gateway Timeout 예외를 발생시키고 payment/error.tsx가 결제 영역만 격리 렌더링하는 것을 확인합니다.',
            actionBadge: '에러 격리',
          },
          {
            step: 3,
            title: '[결제 다시 시도 (reset())] 클릭 복구',
            description: '상단 주문 내역 헤더가 유지된 상태에서 reset() 버튼을 눌러 결제 세그먼트가 정상 화면으로 복구되는 것을 관찰합니다.',
            actionBadge: '무중단 복구',
            observe: '상위 주문 요약 헤더는 보존된 채 에러 UI가 사라지고 정상 결제 수단 선택 화면으로 즉시 복구됨',
            observeAt: 'playground',
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
