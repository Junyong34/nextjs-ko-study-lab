'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OrderSummaryHeader } from './components/OrderSummaryHeader'
import { VerificationFooter } from './components/VerificationFooter'
import { PaymentFlowProvider, usePaymentFlow } from './components/context'

function SegmentErrorLayoutContent({ children }: { children: React.ReactNode }) {
  const { stage, errorMsg } = usePaymentFlow()

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
            description: '결제 세그먼트로 진입하여 주문 금액을 확인합니다.',
            actionBadge: '세그먼트 진입',
          },
          {
            step: 2,
            title: '[결제 통신 에러 강제 발생 (error.tsx 테스트)] 클릭',
            description: 'PG 통신 장애를 시뮬레이션하여 에러 바운더리를 트리거합니다.',
            actionBadge: '에러 유발',
          },
          {
            step: 3,
            title: '[결제 다시 시도 (reset())] 클릭',
            description: 'error.tsx에서 제공하는 reset() 함수를 호출하여 에러 상태를 초기화합니다.',
            actionBadge: '에러 리셋',
          },
          {
            step: 4,
            title: '[208,000원 결제 완료하기] 정상 결제 및 상태 관찰',
            description: '에러 복구 후 정상 결제 승인을 실행하여 성공 상태로 전환되는지 관찰합니다.',
            actionBadge: '정상 복구 관찰',
            observe: 'error.tsx가 상위 레이아웃을 깨뜨리지 않고 결제 세그먼트만 격리하여 복구함',
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
      <VerificationFooter stage={stage} errorMsg={errorMsg} />
    </DemoContainer>
  )
}

export default function SegmentErrorRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PaymentFlowProvider>
      <SegmentErrorLayoutContent>{children}</SegmentErrorLayoutContent>
    </PaymentFlowProvider>
  )
}
