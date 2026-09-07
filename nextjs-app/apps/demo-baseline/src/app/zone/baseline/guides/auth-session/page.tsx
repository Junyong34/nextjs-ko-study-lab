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
            title: "[사용자 로그인 (CUSTOMER)] 버튼 클릭",
            description: "일반 회원으로 로그인해 서버 Action이 실제 httpOnly 세션 쿠키를 발급하는지 확인합니다.",
            actionBadge: "일반 세션 생성",
          },
          {
            step: 2,
            title: "[로그아웃] 후 [관리자 로그인 (ADMIN)] 버튼 클릭",
            description: "쿠키를 지운 뒤 관리자로 다시 로그인해 권한이 다른 세션으로 전환되는지 확인합니다.",
            actionBadge: "관리자 세션 전환",
          },
          {
            step: 3,
            title: "브라우저 새로고침으로 쿠키 지속성 확인",
            description: "로그인 상태에서 페이지를 새로고침해도 실제 쿠키에 저장된 세션이 그대로 유지되는지 확인합니다.",
            actionBadge: "쿠키 지속성 확인",
          },
          {
            step: 4,
            title: "[로그아웃] 버튼 클릭 후 세션 파기 관찰",
            description: "세션 쿠키가 삭제되어 비인증 상태로 복귀하고, 새로고침해도 익명 상태가 유지되는지 검증합니다.",
            actionBadge: "세션 파기",
            observe: "로그인/로그아웃 시 실제 쿠키(개발자 도구 Application 탭)가 설정·삭제되고, 새로고침 후에도 그 상태가 유지되는 것을 관찰",
            observeAt: "playground",
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="이커머스 인증 및 세션 권한 시뮬레이터" className="space-y-4">
        <AuthSessionClient initialSession={session} />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter
        isLoaded={typeof session.isLoggedIn === 'boolean'}
        actual={
          session.isLoggedIn
            ? `- isLoggedIn: true\n- role: ${session.role}\n- userId: ${session.userId}\n- 실제 httpOnly 쿠키(${session.token})가 설정되어 있어 새로고침해도 유지됩니다.`
            : '- isLoggedIn: false\n- 세션 쿠키가 없어 익명 상태입니다.'
        }
        expected="로그인 버튼 클릭 시 서버 Action이 실제 httpOnly 쿠키를 설정하고, 새로고침해도 이 브라우저의 로그인 상태가 유지되어야 한다. 로그아웃하면 쿠키가 삭제되어 다시 익명 상태로 돌아가야 한다."
      />
    </DemoContainer>
  )
}
