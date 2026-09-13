import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/after/background-logging')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { AfterLoggingDemo } from './components/AfterLoggingDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="after() 백그라운드 주문 로깅"
        concept="after()는 콜백을 응답이 끝난 뒤에 실행되도록 예약합니다. Server Action이 값을 반환하는 즉시(T1) 클라이언트는 결제 완료 화면을 보고, 그 이후 서버에서 after() 콜백이 실행되어(T2~T3) 카드 정보를 해시로 마스킹한 감사 로그를 남깁니다."
        steps={[
          {
            step: 1,
            title: "[최종 결제 승인 요청] 클릭",
            description: "주문 결제 Server Action(submitOrder)을 호출합니다.",
            actionBadge: "결제 요청",
          },
          {
            step: 2,
            title: "Server Action 반환 시각(T1) 확인",
            description: "함수가 반환되자마자 클라이언트 화면에 T1 타임스탬프가 즉시 표시됩니다.",
            actionBadge: "응답 반환",
          },
          {
            step: 3,
            title: "after() 콜백 실행 시각(T2, T3) 관찰",
            description: "서버가 실제로 감사 로그 해시 마스킹 작업을 완료할 때까지의 시각을 실측해 T1과 비교합니다.",
            actionBadge: "백그라운드 완료",
            observe: "after() 콜백 시작 시각(T2)이 항상 Server Action 반환 시각(T1)보다 늦거나 같은지 검증 패널에서 확인",
            observeAt: "verification",
          },
        ]}
      />
      <AfterLoggingDemo />
    </DemoContainer>
  )
}
