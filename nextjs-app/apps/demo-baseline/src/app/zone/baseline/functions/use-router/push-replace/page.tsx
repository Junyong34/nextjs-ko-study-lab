import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-router/push-replace')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProductOrderPlayground } from './components/ProductOrderPlayground'
import { NavigationVerificationFooter } from './components/NavigationVerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="useRouter push, replace, back 프로그래밍 방식 내비게이션"
        concept="useRouter()의 router.push()/router.replace()/router.back()으로 브라우저 히스토리 스택과 URL을 실제로 조작합니다. push는 새 엔트리를 추가하고, replace는 현재 엔트리를 교체하며, back은 직전 엔트리로 돌아갑니다."
        steps={[
          {
            step: 1,
            title: '[주문하기 → router.push(주문 완료)] 클릭',
            description: '상품 상세에서 주문 완료 화면으로 실제로 이동합니다. push는 히스토리에 새 엔트리를 추가합니다.',
            actionBadge: 'push 이동',
            observe: 'URL이 /orders/complete로 바뀌고, window.history.length가 1 늘어남',
            observeAt: 'verification',
          },
          {
            step: 2,
            title: '[계속 쇼핑하기 → router.replace()] 클릭',
            description: '주문 완료 화면에서 상품 상세로 되돌아가며, 완료 화면 엔트리는 히스토리에서 지워집니다.',
            actionBadge: 'replace 교체',
            observe: '상품 상세로 돌아오지만 history.length는 늘지 않음(엔트리 추가 없음)',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[주문하기]로 다시 이동한 뒤 [이전 화면으로 → router.back()] 클릭',
            description: 'router.back()이 히스토리 스택의 직전 라우트로 이동하는 것을 확인합니다.',
            actionBadge: '스택 복귀',
            observe: '상품 상세로 돌아오며 history.length도 늘지 않음(replace와 같은 신호, 원리는 다름)',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="상품 상세 — 주문하기(router.push)">
        <ProductOrderPlayground />
      </DemoPlaygroundCard>
      <NavigationVerificationFooter variant="root" />
    </DemoContainer>
  )
}
