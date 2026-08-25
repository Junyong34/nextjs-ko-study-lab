import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { HeadersCustomAuthDemo } from './components/HeadersCustomAuthDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { validateAuthTokenAction } from './actions'

export default async function DemoPage() {
  const initialResult = await validateAuthTokenAction(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4OTIxIiwicm9sZSI6InZpcCJ9'
  )

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="headers().get('authorization') 커스텀 인증 토큰 검증"
        concept="서버 컴포넌트 및 Route Handler에서 headers().get('authorization')을 읽어 Bearer 토큰의 유효성을 검증하고 401 Unauthorized 방어를 수행합니다."
        steps={[
          {
            step: 1,
            title: "기본 [유효 Bearer 토큰] 상태에서 서버 headers() 파싱 결과 확인",
            description: "클라이언트 요청 시 Bearer 토큰이 전달되는 HTTP 요청 헤더 명세를 확인합니다. headers().get('authorization')으로 토큰을 추출하고 서명 유효성을 검증합니다.",
            actionBadge: "헤더 구조 점검",
          },
          {
            step: 2,
            title: "[만료된 토큰] 또는 [위조 토큰] 프리셋 선택 후 [토큰 검증] 실행",
            description: "비정상 토큰 주입 시 401 Unauthorized 거부 응답이 발생하는지 확인합니다.",
            actionBadge: "인가 테스트",
          },
          {
            step: 3,
            title: "인증 완료 상태 및 HTTP 200 OK 보안 컨텍스트 관찰",
            description: "유효한 토큰 인증 시 보호된 쇼핑몰 데이터(User ID, 권한)가 안전하게 반환되는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "Authorization 헤더 검증 성공 시 보호된 회원/결제 데이터가 정상 반환됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="headers().get('authorization') 커스텀 인증 토큰 검증 실습">
        <HeadersCustomAuthDemo initialResult={initialResult} />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
