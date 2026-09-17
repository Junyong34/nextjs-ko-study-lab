import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/redirecting/session-expired')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RedirectSessionDemo } from './components/RedirectSessionDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Server Action 내 redirect()를 통한 세션 만료 로그인 리다이렉트"}
        concept={"보호된 결제 화면에서 세션이 만료되면 Server Action 안에서 redirect('/login?returnUrl=/checkout')를 호출합니다. 이 데모처럼 자바스크립트가 켜진 클라이언트에서 Server Action을 호출하면 클라이언트 사이드 전환으로 처리되고, 자바스크립트 없이 폼만 제출된 경우에만 303 See Other 응답으로 처리됩니다. 307 Temporary Redirect는 Server Component 렌더링 중이나 Route Handler처럼 다른 컨텍스트에서 redirect()를 호출할 때만 사용됩니다."}
        steps={[
          {
            step: 1,
            title: "현재 상태(결제 진행 중) 확인",
            description: "실습화면에 표시된 초기 상태를 확인합니다. 이 데모는 실제 쿠키·세션 검사를 구현하지 않으며, 버튼 클릭 자체가 세션 만료 트리거입니다.",
            actionBadge: "초기 상태 확인",
          },
          {
            step: 2,
            title: "[세션 만료 시뮬레이션] 버튼 클릭",
            description: "expireSessionAction() Server Action이 실행되어 redirect()를 호출합니다.",
            actionBadge: "만료 트리거",
          },
          {
            step: 3,
            title: "로그인 화면 전이 및 returnUrl 파라미터 관찰",
            description: "버튼 클릭 후 브라우저가 로그인 화면으로 이동하는 과정과, 이 전환을 만든 실제 서버 응답을 확인합니다.",
            actionBadge: "전이 검증",
            observe: "Network 탭에서 Server Action 요청의 응답 헤더(x-action-redirect)를 확인하고, 이동한 로그인 화면 하단의 검증 패널에서 returnUrl 값이 일치하는지 확인",
            observeAt: "network",
          },
        ]}
      />
      <DemoPlaygroundCard title={"세션 만료 시 returnUrl과 함께 로그인 리다이렉트 실습"}>
        <RedirectSessionDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
