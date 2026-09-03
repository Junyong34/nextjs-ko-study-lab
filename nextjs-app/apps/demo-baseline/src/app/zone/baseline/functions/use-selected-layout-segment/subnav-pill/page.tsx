import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-selected-layout-segment/subnav-pill')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UseSelectedSegmentDemo } from './components/UseSelectedSegmentDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="useSelectedLayoutSegment() 하위 탭 인디케이터"
        concept="useSelectedLayoutSegment() 훅을 호출하여 현재 레이아웃 바로 하위의 1단계 활성 세그먼트 문자열을 판별하고 서브 내비게이션 Pill 인디케이터를 동적으로 렌더링합니다."
        steps={[
          {
            step: 1,
            title: "[overview], [specs], [reviews], [shipping] 탭 버튼 클릭",
            description: "서브 내비게이션 바에서 하위 라우트 탭을 클릭하여 세그먼트를 전환합니다.",
            actionBadge: "세그먼트 전환",
          },
          {
            step: 2,
            title: "useSelectedLayoutSegment 반환값 확인",
            description: "훅이 반환한 1단계 하위 세그먼트 문자열과 현재 탭의 일치 여부를 판별합니다.",
            actionBadge: "문자열 판별",
          },
          {
            step: 3,
            title: "서브내비 Pill 인디케이터 렌더링 관찰",
            description: "활성화된 세그먼트 탭 위치로 파란색 배경 강조 인디케이터가 이동하는지 확인합니다.",
            actionBadge: "렌더 검증",
            observe: "선택한 1단계 하위 세그먼트명에 맞춰 서브내비 Pill 인디케이터가 즉시 이동함",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"useSelectedLayoutSegment() 하위 탭 인디케이터 실습"}>
        <UseSelectedSegmentDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
