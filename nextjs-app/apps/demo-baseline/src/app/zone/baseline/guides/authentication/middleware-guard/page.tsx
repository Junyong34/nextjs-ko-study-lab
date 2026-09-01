import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { MiddlewareGuardSection } from './components/MiddlewareGuardSection'
import { getAuthCookieState } from './actions'

export default async function DemoPage() {
  const initialAuthState = await getAuthCookieState()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Next.js Proxy 라우트 가드 및 인증 쿠키 검증"
        concept="Next.js 16의 proxy.ts가 요청의 auth_token 쿠키 유효성을 렌더링 이전에 검증하여, 비인증 요청이 보호 경로(/admin, /mypage)에 접근하면 실제 307 리다이렉트 응답을 보냅니다. [테스트] 버튼은 브라우저 fetch로 이 Proxy에 실제 왕복 요청을 보내 response.redirected 값을 관찰합니다."
        steps={[
          {
            step: 1,
            title: "현재 인증 쿠키 상태((없음)) 확인",
            description: "토큰이 없는 초기 비인증 상태에서 Proxy 라우트 가드 조건을 확인합니다.",
            actionBadge: "쿠키 상태 점검",
          },
          {
            step: 2,
            title: "[쿠키 토글] 버튼 클릭으로 auth_token=valid 발급",
            description: "인증 토큰을 주입하여 Proxy 검증을 통과할 수 있는 자격을 부여합니다.",
            actionBadge: "토큰 발급",
          },
          {
            step: 3,
            title: "Proxy 가드 통과 및 보호 구역 인가 상태 관찰",
            description: "쿠키 발급 후 보호된 라우트 접근이 허용되고 인증 상태가 정상 반영되는지 검증합니다.",
            actionBadge: "인가 검증",
            observe: "쿠키 토글에 따른 auth_token 상태 변경 및 Proxy 라우트 가드 통과 결과 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <MiddlewareGuardSection initialState={initialAuthState} />
    </DemoContainer>
  )
}
