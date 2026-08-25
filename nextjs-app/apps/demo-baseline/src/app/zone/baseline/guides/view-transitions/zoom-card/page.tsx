import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ViewTransitionsDemo } from './components/ViewTransitionsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"View Transitions API를 통한 카드 확대 모핑 애니메이션"}
        concept={"document.startViewTransition() API를 활용하여 썸네일 그리드 뷰에서 상세 확대 뷰로 전환할 때 브라우저 네이티브 하드웨어 가속 모핑 애니메이션을 부드럽게 구현합니다."}
        steps={[
          {
            step: 1,
            title: "썸네일 그리드 뷰 초기 상태 확인",
            description: "전환 전 카드 썸네일 레이아웃과 View Transition 지원 상태를 확인합니다.",
            actionBadge: "썸네일 확인",
          },
          {
            step: 2,
            title: "[전환 애니메이션 실행] 버튼 클릭",
            description: "View Transition을 트리거하여 썸네일 카드를 상세 확대 뷰로 전환합니다.",
            actionBadge: "트랜지션 실행",
          },
          {
            step: 3,
            title: "확대 상세 뷰 모핑 애니메이션 및 부드러운 전환 관찰",
            description: "DOM 구조 변경 시 브라우저가 이전/이후 스냅샷을 교차 페이드 및 크기 모핑하는 과정을 검증합니다.",
            actionBadge: "모핑 검증",
            observe: "전환 애니메이션 실행 클릭 시 썸네일에서 확대 상세 뷰로의 부드러운 View Transition 모핑 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"View Transitions 이미지 확대 애니메이션 실습"}>
        <ViewTransitionsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
