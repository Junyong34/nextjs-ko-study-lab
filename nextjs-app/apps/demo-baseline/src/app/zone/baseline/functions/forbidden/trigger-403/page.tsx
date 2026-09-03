import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/forbidden/trigger-403')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ForbiddenTriggerDemo } from './components/ForbiddenTriggerDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="forbidden() 403 인가 거부 트리거"
        concept="Next.js 15.1+ forbidden() 함수를 호출하여 비인가 사용자의 관리자 페이지 접근을 차단하고 HTTP 403 Forbidden 상태와 forbidden.tsx UI를 렌더링합니다."
        steps={[
          {
            step: 1,
            title: "[일반 고객 (CUSTOMER)] 또는 [스토어 관리자 (ADMIN)] 역할 선택",
            description: "권한 검증을 테스트할 사용자 역할을 선택합니다.",
            actionBadge: "역할 선택",
          },
          {
            step: 2,
            title: "[정산 관리자 페이지 접근 시도] 클릭",
            description: "관리자 전용 리소스에 접근하여 forbidden() 권한 검사를 수행합니다.",
            actionBadge: "인가 검사",
          },
          {
            step: 3,
            title: "HTTP 403 Forbidden 및 forbidden.tsx UI 관찰",
            description: "일반 고객의 경우 접근이 거부되어 403 상태와 forbidden.tsx 전용 화면이 렌더링되는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "CUSTOMER 권한 접근 시 forbidden()이 호출되어 HTTP 403 및 접근 거부 UI가 렌더링됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"forbidden() 403 인가 거부 트리거 실습"}>
        <ForbiddenTriggerDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
