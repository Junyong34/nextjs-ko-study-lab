import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MiddlewareGuardDemo } from './components/MiddlewareGuardDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Next.js 미들웨어 라우트 가드 및 인증 쿠키 검증"}
        concept={"middleware.ts에서 요청 헤더의 auth_token 쿠키 유효성을 사전에 검증하여, 비인증 사용자의 보호 경로(/admin, /mypage) 접근을 0ms 에지 레벨에서 로그인 페이지로 차단합니다."}
        steps={[
          {
            step: 1,
            title: "현재 인증 쿠키 상태((없음)) 확인",
            description: "토큰이 없는 초기 비인증 상태에서 미들웨어 라우트 가드 조건을 확인합니다.",
            actionBadge: "쿠키 상태 점검",
          },
          {
            step: 2,
            title: "[쿠키 토글] 버튼 클릭으로 auth_token=valid 발급",
            description: "인증 토큰을 주입하여 미들웨어 검증을 통과할 수 있는 자격을 부여합니다.",
            actionBadge: "토큰 발급",
          },
          {
            step: 3,
            title: "미들웨어 가드 통과 및 보호 구역 인가 상태 관찰",
            description: "쿠키 발급 후 보호된 라우트 접근이 허용되고 인증 상태가 정상 반영되는지 검증합니다.",
            actionBadge: "인가 검증",
            observe: "쿠키 토글에 따른 auth_token 상태 변경 및 미들웨어 라우트 가드 통과 결과 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Proxy/Middleware 기반 라우트 보호 가드 실습"}>
        <MiddlewareGuardDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
