import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/rewrites/cross-zone-proxy')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigRewritesProxyDemo } from './components/ConfigRewritesProxyDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="rewrites() Zone 간 라우팅 및 외부 API 프록시"
        concept="next.config.ts의 rewrites() 설정을 활용하여 /legacy-api/:path* 경로의 요청을 외부 백엔드 서버로 투명하게 프록시 중계하고 CORS 문제를 해결합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "크로스 존 프록시 요청 대상 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "rewrites 규칙에 따라 외부 마이크로서비스로 중계되는 API 호출을 실행합니다.",
            actionBadge: "프록시 실행",
          },
          {
            step: 3,
            title: "투명 프록시 응답 및 도메인 로그 관찰",
            description: "클라이언트 URL 변경 없이 외부 존(Zone)의 백엔드 응답이 정상 수신되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "next.config.ts rewrites 규칙에 따라 외부 엔드포인트 프록시 응답이 정상 수신됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"rewrites() Zone 간 라우팅 및 외부 API 프록시 실습"}>
        <ConfigRewritesProxyDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
