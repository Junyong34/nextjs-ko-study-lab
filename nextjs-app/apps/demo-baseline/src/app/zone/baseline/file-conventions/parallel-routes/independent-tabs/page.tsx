import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ParallelIndependentTabsDemo } from './components/ParallelIndependentTabsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="병렬 라우트 독립 탭 상태 유지 네비게이션"
        concept="layout.tsx 내의 @dashboard와 @metrics 2개 슬롯이 각자의 서브 네비게이션을 수행하며, 한쪽 슬롯의 탭을 전환해도 다른 쪽 슬롯의 상태와 스크롤이 유지됩니다."
        steps={[
          {
            step: 1,
            title: "슬롯 1(@dashboard)의 [요약 지표] 및 [매출 추이] 탭 전환",
            description: "대시보드 슬롯 내부의 하위 탭으로 이동하여 해당 슬롯만 독립적으로 갱신합니다.",
            actionBadge: "슬롯 1 이동",
          },
          {
            step: 2,
            title: "슬롯 2(@metrics)의 [주간 (7d)] 및 [월간 (30d)] 탭 전환",
            description: "메트릭스 슬롯 내부의 기간 탭을 변경하여 독립적으로 데이터를 로드합니다.",
            actionBadge: "슬롯 2 이동",
          },
          {
            step: 3,
            title: "병렬 슬롯 간 독립 네비게이션 및 상태 격리 관찰",
            description: "한쪽 슬롯의 탭 이동이 다른 쪽 슬롯의 렌더링 상태를 초기화하지 않는지 확인합니다.",
            actionBadge: "상태 격리 검증",
            observe: "두 병렬 슬롯(@dashboard, @metrics)의 독립 네비게이션 상태 및 탭 선택값이 상호 간섭 없이 보존됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="독립 탭 네비게이션 슬롯 (Parallel Routes) 실습">
        <ParallelIndependentTabsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
