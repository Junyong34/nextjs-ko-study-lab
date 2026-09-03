import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/cookies/delete-logout')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CookiesDeleteDemo } from './components/CookiesDeleteDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="cookies().delete() 세션 파기 및 로그아웃"
        concept="cookies().delete()를 Server Action 내부에서 호출하여 클라이언트 브라우저에 저장된 인증 세션 쿠키를 즉시 만료시키고 보안 로그아웃을 수행합니다."
        steps={[
          {
            step: 1,
            title: "[로그아웃 (cookies().delete)] 클릭",
            description: "로그아웃 Server Action을 호출하여 현재 저장된 session-token 쿠키를 삭제합니다.",
            actionBadge: "로그아웃 실행",
          },
          {
            step: 2,
            title: "Set-Cookie 만료 헤더(Max-Age=0) 전송 확인",
            description: "서버가 응답 헤더로 쿠키 만료 지시자를 전송하여 브라우저 저장소를 비우는 과정을 확인합니다.",
            actionBadge: "쿠키 파기",
          },
          {
            step: 3,
            title: "비로그인 게스트 상태 전환 관찰",
            description: "화면의 사용자 프로필이 게스트 상태로 전환되고 세션 쿠키가 제거되었는지 확인합니다.",
            actionBadge: "상태 검증",
            observe: "cookies().delete() 호출 후 세션 쿠키가 즉시 파기되고 게스트 상태로 전환됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"cookies().delete() 세션 파기 및 로그아웃 실습"}>
        <CookiesDeleteDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
