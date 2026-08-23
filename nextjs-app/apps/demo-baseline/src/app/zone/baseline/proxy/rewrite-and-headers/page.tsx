import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProxySimulatorClient } from './components/ProxySimulatorClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function ProxyRewriteAndHeadersDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js 16 proxy.ts 요청 가로채기 & NextResponse.rewrite/헤더 주입"
        concept="Next.js 16 proxy.ts(프록시/미들웨어)는 렌더링 전 요청을 가로채어 주소창 URL 유지 rewrite, GeoIP/인증 커스텀 헤더 주입, 세션 만료 시 307 redirect를 수행합니다."
        steps={[
          {
            step: 1,
            title: '[실험군 (Variant B)] 버킷 선택',
            description: 'A/B 테스트 버킷을 변경하여 주소창 URL(/landing)은 그대로 유지된 채 내부적으로 Variant B 페이지가 렌더링되는 rewrite를 확인합니다.',
            actionBadge: 'NextResponse.rewrite',
          },
          {
            step: 2,
            title: '[헤더 주입] 탭 클릭',
            description: '프록시 파이프라인에서 downstream 컴포넌트로 주입되는 x-forwarded-country 및 x-user-authenticated 커스텀 헤더를 확인합니다.',
            actionBadge: '헤더 주입',
          },
          {
            step: 3,
            title: '[Redirect] 탭 전환 및 [로그인 세션 유효] 체크 해제 대조',
            description: '인증 토큰 유무 체크를 해제하여 미인증 요청 시 즉각적인 307 Temporary Redirect 동작이 발생하는 것을 대조 관찰합니다.',
            actionBadge: 'NextResponse.redirect',
            observe: 'URL 유지 rewrite(Variant B)와 커스텀 주입 헤더(x-forwarded-country), 그리고 미인증 시 /login으로의 307 Redirect가 검증됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Next.js 16 Proxy 파이프라인 인터랙티브 시뮬레이터" className="space-y-4">
        <ProxySimulatorClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
