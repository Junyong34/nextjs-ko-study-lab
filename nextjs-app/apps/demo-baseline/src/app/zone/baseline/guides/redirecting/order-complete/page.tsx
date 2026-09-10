import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/redirecting/order-complete')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RedirectOrderDemo } from './components/RedirectOrderDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Server Action 내 redirect()를 통한 주문 완료 화면 이동"}
        concept={"결제를 처리하는 Server Action 안에서 redirect()를 호출하면 Next.js가 주문 완료 화면으로 이동시킵니다. 자바스크립트가 켜진 일반적인 상황에서는 클라이언트 사이드 전환으로 처리되고, 자바스크립트 없이 폼만 제출된 경우에만 303 See Other 응답으로 처리됩니다."}
        steps={[
          {
            step: 1,
            title: "주문 결제 금액(219,000원) 확인",
            description: "결제 진행 전 주문 요약 내역을 확인합니다.",
            actionBadge: "주문 요약 확인",
          },
          {
            step: 2,
            title: "[219,000원 결제하기] 클릭",
            description: "Server Action을 실행해 결제 승인 처리 후 redirect()를 호출합니다.",
            actionBadge: "결제 및 리다이렉트",
          },
          {
            step: 3,
            title: "주문 완료 화면 전이 및 실제 응답 관찰",
            description: "결제 버튼 클릭 후 브라우저가 주문 완료 화면으로 이동하는 과정과, 이 전환을 만든 실제 서버 응답을 확인합니다.",
            actionBadge: "전이 검증",
            observe: "Network 탭에서 Server Action 요청의 응답 헤더(x-action-redirect)를 확인하고, 이동한 완료 화면 하단의 검증 패널에서 실제 결제 금액이 반영됐는지 확인",
            observeAt: "network",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Server Action 내 redirect()를 통한 주문 완료 화면 이동 실습"}>
        <RedirectOrderDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
