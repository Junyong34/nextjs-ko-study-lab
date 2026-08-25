import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { HydrationBoundaryDemo } from './components/HydrationBoundaryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"하이드레이션 경계 및 클라이언트 마운트 생명주기"}
        concept={"서버에서 사전 렌더링된 정적 HTML이 브라우저에서 React 이벤트 리스너와 결합(Hydration)되는 과정을 추적하고, useEffect 마운트 시점 전후의 UI 상태 불일치를 방어합니다."}
        steps={[
          {
            step: 1,
            title: "서버 렌더링 정적 HTML 초기 스냅샷 확인",
            description: "하이드레이션 전 서버에서 전달된 초기 마크업과 텍스트 내용을 확인합니다.",
            actionBadge: "초기 HTML 확인",
          },
          {
            step: 2,
            title: "[하이드레이션 활성화] 버튼 클릭",
            description: "클라이언트 마운트 상태를 활성화하여 브라우저 전용 이벤트 및 상태를 바인딩합니다.",
            actionBadge: "하이드레이션 트리거",
          },
          {
            step: 3,
            title: "마운트 완료 상태(Hydrated) 전환 및 인터랙션 활성화 관찰",
            description: "클라이언트 상태가 활성화되어 동적 시간 정보 및 인터랙티브 버튼이 동작하는지 검증합니다.",
            actionBadge: "생명주기 검증",
            observe: "하이드레이션 활성화 클릭 후 클라이언트 마운트 완료(mounted: true) 및 인터랙티브 UI 활성화 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"하이드레이션 경계와 번들 격리 실습"}>
        <HydrationBoundaryDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
