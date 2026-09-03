import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/unauthorized/trigger-401')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UnauthorizedTriggerDemo } from './components/UnauthorizedTriggerDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="unauthorized() 401 인증 필요 트리거"
        concept="Next.js 15.1+ unauthorized() 함수를 호출하여 비로그인 사용자의 보호된 라우트 접근을 감지하고 HTTP 401 Unauthorized 상태와 unauthorized.tsx UI를 렌더링합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "보호된 주문 상세 리소스를 선택합니다.",
            actionBadge: "리소스 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "세션 없는 상태에서 보호된 서버 컴포넌트에 접근하여 unauthorized()를 트리거합니다.",
            actionBadge: "unauthorized 실행",
          },
          {
            step: 3,
            title: "HTTP 401 응답 및 unauthorized.tsx 로그인 안내 관찰",
            description: "HTTP 401 에러 상태와 로그인 요구 unauthorized.tsx 화면이 표시되는지 확인합니다.",
            actionBadge: "401 검증",
            observe: "unauthorized() 호출에 따라 HTTP 401 상태 코드 및 인증 필요 안내가 실시간 로그에 반영됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"unauthorized() 401 인증 필요 트리거 실습"}>
        <UnauthorizedTriggerDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
