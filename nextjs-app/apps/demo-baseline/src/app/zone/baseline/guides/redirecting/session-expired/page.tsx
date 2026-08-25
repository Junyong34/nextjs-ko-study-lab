import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RedirectSessionDemo } from './components/RedirectSessionDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"세션 만료 감지 시 307 임시 리다이렉트 처리"}
        concept={"보호된 결제 라우트에서 세션 쿠키 만료를 감지하면 Next.js redirect('/login?returnUrl=/checkout')를 실행하여 307 Temporary Redirect로 안전하게 로그인 화면으로 복귀시킵니다."}
        steps={[
          {
            step: 1,
            title: "현재 상태(결제 진행 중) 및 세션 유효성 확인",
            description: "체크아웃 페이지에 접근한 초기 활성 세션 상태를 점검합니다.",
            actionBadge: "세션 상태 점검",
          },
          {
            step: 2,
            title: "[세션 만료 시뮬레이션] 버튼 클릭",
            description: "인증 토큰을 강제 만료시키고 서버 리다이렉트 핸들러를 트리거합니다.",
            actionBadge: "만료 시뮬레이션",
          },
          {
            step: 3,
            title: "307 Redirect 발동 및 로그인 반환 URL 파라미터 관찰",
            description: "상태가 307 Redirect -> /login?returnUrl=/checkout 으로 즉시 전환되는 과정을 검증합니다.",
            actionBadge: "리다이렉트 검증",
            observe: "세션 만료 트리거 시 307 Redirect 발생 및 returnUrl 쿼리가 포함된 로그인 경로 전이 관찰",
            observeAt: "playground",
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
