import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/auth-session')

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
        title={"서버 사이드 인증 세션 및 사용자 프로필 렌더링"}
        concept={"서버 컴포넌트에서 HTTP-only 세션 쿠키(cookies())를 검증하여 비로그인 사용자에게는 로그인 유도 배너를, 인증 사용자에게는 100% 서버 사이드 프로필 정보를 렌더링합니다."}
        steps={[
          {
            step: 1,
            title: "[사용자 로그인 (CUSTOMER)], [관리자 로그인 (ADMIN)] 선택",
            description: "일반 회원 세션 쿠키를 발급받아 기본 프로필 렌더링을 확인합니다.",
            actionBadge: "일반 세션 생성",
          },
          {
            step: 2,
            title: "[관리자(Admin)로 로그인] 버튼 클릭으로 권한 승격",
            description: "관리자 권한 세션으로 전환하여 관리자 전용 대시보드 권한을 부여받습니다.",
            actionBadge: "관리자 세션 전환",
          },
          {
            step: 3,
            title: "[처리 중... 로그아웃] 버튼 클릭으로 세션 파기",
            description: "세션 쿠키를 제거하여 비인증 상태로 원복되는지 테스트합니다.",
            actionBadge: "세션 파기",
          },
          {
            step: 4,
            title: "인증된 사용자 프로필 및 권한 배지 관찰",
            description: "세션 정보(관리자/일반사용자)와 회원 전용 혜택 영역이 정상 표시되는지 검증합니다.",
            actionBadge: "프로필 렌더링",
            observe: "세션 상태 전환에 따른 사용자 프로필 카드 및 권한별 보호 UI 활성화 관찰",
            observeAt: "playground",
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
