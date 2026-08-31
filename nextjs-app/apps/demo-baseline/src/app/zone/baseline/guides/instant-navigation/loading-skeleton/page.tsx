import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InstantNavDemo } from './components/InstantNavDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"loading.tsx 스켈레톤을 활용한 즉각적인 내비게이션 피드백"}
        concept={"느린 데이터 패칭 라우트로 실제 이동하면 shop/loading.tsx가 데이터보다 먼저 즉시 마운트되어 스켈레톤 UI를 제공함으로써 사용자에게 화면 멈춤 없는 내비게이션 경험을 선사합니다."}
        steps={[
          {
            step: 1,
            title: "현재 홈 화면 확인",
            description: "아직 이동하지 않은 초기 상태를 확인합니다.",
            actionBadge: "초기 확인",
          },
          {
            step: 2,
            title: "[쇼핑몰 진입 (스켈레톤 관찰) →] 실제 링크 클릭",
            description: "실제 서브 라우트로 이동하여 loading.tsx 스켈레톤 마운트를 관찰합니다.",
            actionBadge: "실제 이동",
          },
          {
            step: 3,
            title: "0ms 스켈레톤 렌더링 후 최종 상품 목록 교체 관찰",
            description: "내비게이션 클릭 즉시 스켈레톤이 뜨고 데이터 완료 후 실제 상품 목록으로 부드럽게 전환되는지 검증합니다.",
            actionBadge: "즉각 피드백 검증",
            observe: "쇼핑몰 이동 클릭 즉시 loading.tsx 스켈레톤 노출 및 데이터 패칭 완료 후 실제 콘텐츠 전환 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Instant Navigation loading.tsx 스켈레톤 전환 실습"}>
        <InstantNavDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
