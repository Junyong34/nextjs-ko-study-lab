import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigRewritesQueryDemo } from './components/ConfigRewritesQueryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="rewrites() 쿼리 파라미터 매핑 라우팅"
        concept="rewrites() 규칙을 통해 깔끔한 REST URL(/shop/shoes/101)을 내부 쿼리 스트링 기반 라우트(/catalog?category=shoes&id=101)로 투명하게 매핑합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "쿼리 매핑 대상 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "패스 파라미터가 쿼리 스트링으로 치환되는 rewrite 규칙을 실행합니다.",
            actionBadge: "쿼리 매핑",
          },
          {
            step: 3,
            title: "내부 쿼리 파라미터 매핑 및 도메인 로그 관찰",
            description: "클라이언트에 노출되는 URL과 서버 내부에서 해석된 쿼리 매핑 결과를 확인합니다.",
            actionBadge: "로그 검증",
            observe: "REST 경로가 next.config.ts rewrites에 의해 내부 쿼리 파라미터로 매핑되어 처리됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"rewrites() 쿼리 파라미터 매핑 라우팅 실습"}>
        <ConfigRewritesQueryDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
