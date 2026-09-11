import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/unauthorized/trigger-401')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UnauthorizedTriggerDemo } from './components/UnauthorizedTriggerDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getCurrentSession } from './actions'

export default async function DemoPage() {
  const currentSession = await getCurrentSession()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="unauthorized() 401 인증 필요 트리거"
        concept="Next.js experimental unauthorized() 함수를 서버 컴포넌트에서 호출하면 미인증 방문자의 마이페이지 주문 내역 접근을 실제로 차단하고, HTTP 401 상태와 unauthorized.tsx UI를 렌더링합니다."
        steps={[
          {
            step: 1,
            title: '[익명 방문자 (ANONYMOUS)] 또는 [로그인 회원 (AUTHENTICATED)] 선택',
            description: '실제 서버 세션 쿠키를 전환합니다. 페이지 로딩 시 초기값은 ANONYMOUS입니다.',
            actionBadge: '세션 선택',
          },
          {
            step: 2,
            title: '[마이페이지 주문 내역 접근 시도 →] 클릭',
            description: '/mypage/orders 서브 라우트로 실제 이동합니다. 서버 컴포넌트가 쿠키를 읽어 인증 여부를 검사합니다.',
            actionBadge: '실제 라우트 이동',
          },
          {
            step: 3,
            title: 'HTTP 401 Unauthorized 및 unauthorized.tsx UI 관찰',
            description:
              'ANONYMOUS 세션으로 접근하면 unauthorized()가 호출되어 401 상태와 unauthorized.tsx 화면이 렌더링됩니다. 하단 패널이 실제 응답 상태 코드를 다시 측정해 보여줍니다.',
            actionBadge: '결과 검증',
            observe: 'ANONYMOUS 접근 시 실제 401, AUTHENTICATED 접근 시 실제 200 — 이동한 페이지 하단의 실측 상태 코드 패널에서 확인',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title="unauthorized() 401 인증 필요 트리거 실습">
        <UnauthorizedTriggerDemo currentSession={currentSession} />
      </DemoPlaygroundCard>
      <VerificationFooter currentSession={currentSession} />
    </DemoContainer>
  )
}
