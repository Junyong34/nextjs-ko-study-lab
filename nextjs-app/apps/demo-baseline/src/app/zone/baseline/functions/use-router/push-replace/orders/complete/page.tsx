import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-router/push-replace/orders/complete')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OrderCompletePlayground } from '../../components/OrderCompletePlayground'
import { NavigationVerificationFooter } from '../../components/NavigationVerificationFooter'

export default function OrderCompletePage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="router.push()로 도착한 실제 서브 라우트"
        concept="이 화면은 router.push('/orders/complete')로 실제로 이동한 주소입니다. 여기서 replace와 back의 차이를 직접 비교합니다."
        steps={[
          {
            step: 1,
            title: '[계속 쇼핑하기 → router.replace()] 클릭',
            description: '이 완료 화면 엔트리를 상품 상세 URL로 교체하며 이동합니다.',
            actionBadge: 'replace 교체',
          },
          {
            step: 2,
            title: '[이전 화면으로 → router.back()] 클릭',
            description: '엔트리를 지우지 않고 히스토리 스택의 직전 라우트로 이동합니다.',
            actionBadge: 'back 복귀',
            observe: '두 버튼 모두 상품 상세로 돌아가지만, history.length 변화 패턴을 아래 검증 패널에서 비교',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="주문 완료 — replace vs back">
        <OrderCompletePlayground />
      </DemoPlaygroundCard>
      <NavigationVerificationFooter variant="complete" />
    </DemoContainer>
  )
}
