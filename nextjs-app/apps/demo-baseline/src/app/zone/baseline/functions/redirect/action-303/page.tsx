import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/redirect/action-303')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RedirectAction303Demo } from './components/RedirectAction303Demo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="Server Action 내 redirect() (303 See Other)"
        concept="Server Action 내부에서 redirect()를 호출하면 HTTP POST 처리 완료 후 브라우저가 새 URL을 GET으로 요청하도록 HTTP 303 See Other 리다이렉트를 수행합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "주문 결제를 진행할 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "주문 생성 후 redirect(/orders/complete)가 호출되는 Server Action을 실행합니다.",
            actionBadge: "redirect 트리거",
          },
          {
            step: 3,
            title: "HTTP 303 상태 코드 및 페이지 이동 로그 관찰",
            description: "POST 후 브라우저가 303 See Other 헤더를 수신하여 완료 페이지로 자동 전환되는지 확인합니다.",
            actionBadge: "303 검증",
            observe: "Server Action 완료 후 HTTP 303 See Other 응답과 함께 완료 경로로 자동 리다이렉트됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Server Action 내 redirect() (303 See Other) 실습"}>
        <RedirectAction303Demo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
