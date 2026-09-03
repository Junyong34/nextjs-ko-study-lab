import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/after/background-logging')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AfterLoggingDemo } from './components/AfterLoggingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="after() 백그라운드 주문 로깅"
        concept="Next.js 15+ after() 함수를 활용하여 클라이언트 HTTP 응답을 0ms 지연 없이 즉시 반환한 후, 백그라운드에서 결제 감사 로그 및 알림톡 발송을 비동기 실행합니다."
        steps={[
          {
            step: 1,
            title: "[최종 결제 승인 요청] 클릭",
            description: "주문 결제 Server Action을 트리거합니다.",
            actionBadge: "결제 요청",
          },
          {
            step: 2,
            title: "0ms 지연 없는 즉각적 클라이언트 응답 확인",
            description: "서버가 결제 완료 응답을 즉시 반환하여 UI 로딩이 멈추는 것을 확인합니다.",
            actionBadge: "응답 완료",
          },
          {
            step: 3,
            title: "after() 백그라운드 비동기 로깅 실행 관찰",
            description: "응답 종료 후 백그라운드에서 감사 로그 저장 및 서드파티 통신이 안전하게 완수되는지 확인합니다.",
            actionBadge: "백그라운드 완료",
            observe: "클라이언트 결제 응답이 0ms 지연 없이 즉시 완료된 후 after() 백그라운드 로깅이 완료됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"after() 백그라운드 주문 로깅 실습"}>
        <AfterLoggingDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
