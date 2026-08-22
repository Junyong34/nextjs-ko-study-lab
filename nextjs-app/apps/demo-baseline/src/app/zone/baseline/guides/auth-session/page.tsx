import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AuthSessionClient } from './components/AuthSessionClient'
import { VerificationFooter } from './components/VerificationFooter'
import { getSession } from './actions'

export default async function AuthSessionDemoPage() {
  const session = await getSession()

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js 인증 & 세션 기반 역할 분기 (RBAC)"
        concept="Next.js는 HttpOnly 쿠키 세션을 활용하여 서버 사이드에서 안전하게 인증 상태를 검증하고, 일반 고객과 관리자(Admin)의 권한에 따라 화면을 분기 렌더링합니다."
        steps={[
          {
            step: 1,
            title: '일반 고객 또는 관리자로 모의 로그인',
            description: '하단 버튼을 눌러 각 역할별 세션을 Server Action으로 발급합니다.',
            actionBadge: '세션 발급',
          },
          {
            step: 2,
            title: '역할별(RBAC) UI 권한 분기 확인',
            description: '로그인된 권한(customer vs admin)에 따라 서로 다른 대시보드가 표시되는 것을 확인합니다.',
            actionBadge: '권한별 화면 분기',
          },
          {
            step: 3,
            title: '로그아웃 및 세션 만료',
            description: '[로그아웃]을 눌러 서버 세션이 안전하게 초기화되는 것을 확인합니다.',
            actionBadge: '세션 파기',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="이커머스 인증 및 세션 권한 시뮬레이터" className="space-y-4">
        <AuthSessionClient initialSession={session} />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
