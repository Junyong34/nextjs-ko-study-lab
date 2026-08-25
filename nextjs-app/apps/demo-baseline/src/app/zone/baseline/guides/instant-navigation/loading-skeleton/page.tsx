import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InstantNavDemo } from './components/InstantNavDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"loading.tsx 스켈레톤을 활용한 즉각적인 내비게이션 피드백"}
        concept={"느린 데이터 패칭 라우트로 이동할 때 loading.tsx가 0ms로 즉시 마운트되어 스켈레톤 UI를 제공함으로써 사용자에게 화면 멈춤(Freezing) 없는 즉각적인 내비게이션 경험을 선사합니다."}
        steps={[
          {
            step: 1,
            title: "[홈 (0ms 즉시 전환)] 버튼 클릭",
            description: "정적 캐시된 홈 화면으로 0ms 즉각 전환되는 동작을 확인합니다.",
            actionBadge: "홈 이동",
          },
          {
            step: 2,
            title: "[쇼핑몰 (스켈레톤 즉시 표시)] 버튼 클릭",
            description: "데이터 패칭이 필요한 쇼핑몰 라우트로 이동하여 loading.tsx 스켈레톤 마운트를 트리거합니다.",
            actionBadge: "스켈레톤 트리거",
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
