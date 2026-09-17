import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/forbidden/trigger-403')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ForbiddenTriggerDemo } from './components/ForbiddenTriggerDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getCurrentDemoRole } from './actions'

export default async function DemoPage() {
  const currentRole = await getCurrentDemoRole()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="forbidden() 403 인가 거부 트리거"
        concept="Next.js experimental forbidden() 함수를 서버 컴포넌트에서 호출하면 비인가 사용자의 관리자 페이지 접근을 실제로 차단하고, HTTP 403 상태와 forbidden.tsx UI를 렌더링합니다."
        steps={[
          {
            step: 1,
            title: '[일반 고객 (CUSTOMER)] 또는 [스토어 관리자 (ADMIN)] 선택',
            description: '실제 서버 세션 쿠키를 전환합니다. 페이지 로딩 시 초기값은 CUSTOMER입니다.',
            actionBadge: '역할 선택',
          },
          {
            step: 2,
            title: '[정산 관리자 페이지 접근 시도 →] 클릭',
            description: '/admin/settlements 서브 라우트로 실제 이동합니다. 서버 컴포넌트가 쿠키를 읽어 권한을 검사합니다.',
            actionBadge: '실제 라우트 이동',
          },
          {
            step: 3,
            title: 'HTTP 403 Forbidden 및 forbidden.tsx UI 관찰',
            description: 'CUSTOMER 역할로 접근하면 forbidden()이 호출되어 403 상태와 forbidden.tsx 화면이 렌더링됩니다. 하단 패널이 실제 응답 상태 코드를 다시 측정해 보여줍니다.',
            actionBadge: '결과 검증',
            observe: 'CUSTOMER 접근 시 실제 403, ADMIN 접근 시 실제 200 — 이동한 페이지 하단의 실측 상태 코드 패널에서 확인',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title="forbidden() 403 인가 거부 트리거 실습">
        <ForbiddenTriggerDemo currentRole={currentRole} />
      </DemoPlaygroundCard>
      <VerificationFooter currentRole={currentRole} />
    </DemoContainer>
  )
}
