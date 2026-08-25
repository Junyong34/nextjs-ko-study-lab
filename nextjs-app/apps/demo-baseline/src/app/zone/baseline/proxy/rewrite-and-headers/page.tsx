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
                    "step": 1,
                    "title": "[대조군 (Control)], [실험군 (Variant B)] 선택",
                    "description": "A/B 테스트 분기 파라미터를 설정하여 요청을 전송합니다.",
                    "actionBadge": "A/B 분기"
          },
          {
                    "step": 2,
                    "title": "[KR 한국], [US 미국] 국가 선택",
                    "description": "클라이언트 국가 헤더를 선택하여 지역별 분기를 요청합니다.",
                    "actionBadge": "국가 선택"
          },
          {
                    "step": 3,
                    "title": "x-user-country 및 x-ab-variant 헤더 주입 확인",
                    "description": "프록시 계층에서 주입된 커스텀 헤더가 서버 컴포넌트에 정상 전달되는지 점검합니다.",
                    "actionBadge": "헤더 점검"
          },
          {
                    "step": 4,
                    "title": "지리적 리라이트 및 실험군 분기 결과 관찰",
                    "description": "국가 및 실험군 조건에 따라 서로 다른 목적지로 프록시 리라이트되는 결과를 관찰합니다.",
                    "actionBadge": "리라이트 검증",
                    "observe": "국가 및 A/B 실험군 선택에 따라 응답 헤더와 렌더링 배너가 동적으로 리라이트됨",
                    "observeAt": "playground"
          }
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
