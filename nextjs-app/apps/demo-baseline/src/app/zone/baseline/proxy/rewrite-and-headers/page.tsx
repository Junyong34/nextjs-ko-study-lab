import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProxySimulatorClient } from './components/ProxySimulatorClient'

export default function ProxyRewriteAndHeadersDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js 16 proxy.ts 요청 가로채기 & NextResponse.rewrite/헤더 주입"
        concept="Next.js 16 proxy.ts는 렌더링 전 요청을 가로채어 주소창 URL 유지 rewrite, GeoIP/인증 커스텀 헤더 주입, 세션 만료 시 307 redirect를 수행합니다."
        steps={[
          {
            step: 1,
            title: '[대조군 (Control)], [실험군 (Variant B)] 선택',
            description: 'A/B 테스트 분기 파라미터를 설정하여 프록시 파이프라인 요청을 구성합니다.',
            actionBadge: 'A/B 분기',
          },
          {
            step: 2,
            title: '[KR 한국], [US 미국] 국가 선택',
            description: '클라이언트 GeoIP 국가를 선택하여 지역별 헤더 및 리라이트 분기를 요청합니다.',
            actionBadge: '국가 선택',
          },
          {
            step: 3,
            title: '[프록시 파이프라인 실행] 클릭 및 헤더 주입 확인',
            description: '실행 버튼을 클릭하여 proxy.ts 가로채기 및 x-proxy-gateway, x-ab-variant, x-forwarded-country 헤더 주입을 확인합니다.',
            actionBadge: '파이프라인 실행',
          },
          {
            step: 4,
            title: '지리적 리라이트 및 실험군 분기 결과 관찰',
            description: '국가 및 실험군 조건에 따라 서로 다른 목적지로 프록시 리라이트되는 결과를 대조 관찰합니다.',
            actionBadge: '리라이트 검증',
            observe: '국가 및 A/B 실험군 선택에 따라 응답 헤더와 렌더링 배너가 동적으로 리라이트됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) 및 3단/4단 */}
      <DemoPlaygroundCard title="Next.js 16 Proxy 파이프라인 인터랙티브 시뮬레이터" className="space-y-4">
        <ProxySimulatorClient />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
