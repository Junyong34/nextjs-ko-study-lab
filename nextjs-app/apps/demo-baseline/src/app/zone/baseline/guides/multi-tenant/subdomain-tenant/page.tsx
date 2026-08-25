import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MultiTenantDemo } from './components/MultiTenantDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"서브도메인 기반 멀티 테넌트(Multi-tenant) 라우트 리라이트"}
        concept={"Next.js 미들웨어에서 URL 호스트(brand-a.shop.com)를 파싱하여 0ms로 내부 경로(/_tenants/brand-a/...)로 rewrites() 처리함으로써 단일 코드베이스로 100개 이상의 독립 테넌트 몰을 서빙합니다."}
        steps={[
          {
            step: 1,
            title: "[테넌트 A (블루 테마)] 서브도메인 초기 상태 확인",
            description: "brand-a 테넌트로 라우팅된 파란색 테마와 브랜드 구성을 확인합니다.",
            actionBadge: "테넌트 A 점검",
          },
          {
            step: 2,
            title: "[테넌트 B (퍼플 테마)] 버튼 클릭",
            description: "호스트 헤더를 brand-b로 시뮬레이션하여 내부 테넌트 리라이트를 트리거합니다.",
            actionBadge: "테넌트 전환",
          },
          {
            step: 3,
            title: "테넌트별 독립 브랜드명 및 전용 레이아웃 분기 관찰",
            description: "URL 변경 없이 서버 리라이트를 통해 완전히 분리된 테넌트 화면이 서빙되는지 검증합니다.",
            actionBadge: "멀티 테넌트 검증",
            observe: "서브도메인 테넌트 전환(brand-a ↔ brand-b)에 따른 전용 테마 및 브랜드 UI 분기 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"서브도메인 기반 테넌트 분기 및 브랜드 테마 실습"}>
        <MultiTenantDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
