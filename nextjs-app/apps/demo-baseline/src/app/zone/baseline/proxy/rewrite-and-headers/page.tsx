import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProxySimulatorClient } from './components/ProxySimulatorClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function ProxyRewriteAndHeadersDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js 16 proxy.ts 요청 가로채기 & rewrite/헤더 주입"
        concept="Next.js 16의 proxy.ts(구 middleware.ts)는 페이지 렌더링이 시작되기 직전에 요청을 가로채어, 브라우저 주소창 URL 변경 없는 A/B 테스트 rewrite, GeoIP 및 인증 헤더 주입, 조건부 redirect를 수행합니다."
        steps={[
          {
            step: 1,
            title: 'A/B 테스트 버킷 변경 (대조군 vs 실험군)',
            description: '상단 툴바에서 버킷을 변경하여 주소창 URL(/landing)은 유지된 채 렌더링 페이지만 변경되는 rewrite를 관찰합니다.',
            actionBadge: 'NextResponse.rewrite',
          },
          {
            step: 2,
            title: 'GeoIP 국가 및 인증 헤더 주입 확인',
            description: '[헤더 주입] 탭을 눌러 프록시가 downstream Server Component로 전달하는 커스텀 헤더를 확인합니다.',
            actionBadge: 'x-forwarded-* 헤더',
          },
          {
            step: 3,
            title: '인증 실패 조건부 Redirect 테스트',
            description: '[로그인 세션 유효] 체크를 해제하여 렌더링 전 즉각적인 307 Temporary Redirect 동작을 확인합니다.',
            actionBadge: 'NextResponse.redirect',
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
