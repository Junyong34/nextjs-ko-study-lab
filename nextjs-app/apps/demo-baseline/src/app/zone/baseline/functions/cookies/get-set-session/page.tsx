import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/cookies/get-set-session')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { CookiesSessionDemo } from './components/CookiesSessionDemo'
import { getSessionCookieState } from './actions'

export default async function DemoPage() {
  const initialState = await getSessionCookieState()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="cookies().get() 읽기 & cookies().set() 세션 쿠키 발급"
        concept="Server Action에서 (await cookies()).set()으로 실제 Set-Cookie 응답 헤더를 보내 HttpOnly 세션 쿠키를 발급하면, 다음 렌더링에서 서버 컴포넌트가 (await cookies()).get()으로 그 값을 그대로 읽어옵니다."
        steps={[
          {
            step: 1,
            title: "[김쇼핑 (CUSTOMER)], [이우수 (VIP)], [박관리 (ADMIN)] 역할 버튼 선택",
            description: "일반 고객(김쇼핑), VIP(이우수), 관리자(박관리) 프로필 버튼을 클릭해 issueSessionAction Server Action을 호출합니다.",
            actionBadge: "역할 선택",
          },
          {
            step: 2,
            title: "cookies().set() 호출 → session-token(HttpOnly) & user-role 쿠키 실제 발급",
            description: "Server Action이 (await cookies()).set()을 호출해 실제 Set-Cookie 응답 헤더 2개를 브라우저로 전송합니다.",
            actionBadge: "쿠키 발급",
          },
          {
            step: 3,
            title: "서버 읽기(cookies().get()) vs document.cookie 비교 관찰",
            description: "서버가 다시 읽은 쿠키 값과 브라우저 JS가 document.cookie로 직접 읽을 수 있는 값을 비교해 httpOnly의 실제 차단 효과를 확인합니다.",
            actionBadge: "헤더 검증",
            observe: "session-token은 httpOnly라서 document.cookie에 나타나지 않고, user-role만 노출됨",
            observeAt: "verification",
          },
        ]}
      />
      <CookiesSessionDemo initialState={initialState} />
    </DemoContainer>
  )
}
