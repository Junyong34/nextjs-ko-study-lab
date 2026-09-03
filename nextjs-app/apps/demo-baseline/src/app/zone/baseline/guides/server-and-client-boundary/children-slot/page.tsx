import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/server-and-client-boundary/children-slot')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ChildrenSlotDemo } from './components/ChildrenSlotDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Children Slot 패턴을 통한 RSC와 RCC 합성"}
        concept={"Client Component(RCC) 내부에 Server Component(RSC)를 직접 import하지 않고 children props 슬롯으로 전달하여 서버 컴포넌트의 0 KB 번들 속성을 유지한 채 합성합니다."}
        steps={[
          {
            step: 1,
            title: "[슬롯 접기 슬롯 펼치기] 토글 버튼 클릭",
            description: "애니메이션 및 접힘 상태를 제어하는 클라이언트 래퍼 컴포넌트의 토글 버튼을 클릭합니다.",
            actionBadge: "RCC 래퍼 조작",
          },
          {
            step: 2,
            title: "[실시간 테마 토글] 클릭",
            description: "서버에서 사전 렌더링되어 슬롯으로 전달된 서버 데이터 블록을 점검합니다.",
            actionBadge: "슬롯 주입 검사",
          },
          {
            step: 3,
            title: "RCC 리렌더링 시 RSC 독립성 및 번들 격리 관찰",
            description: "클라이언트 래퍼가 상태 변경으로 리렌더링되어도 children으로 주입된 RSC는 서버 렌더링 상태를 보존함을 확인합니다.",
            actionBadge: "합성 검증",
            observe: "RCC 래퍼의 인터랙션 실행 시에도 children 슬롯의 RSC가 클라이언트 번들로 번들링되지 않는 합성 구조 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Server and Client Component 합성과 children 슬롯 주입 실습"}>
        <ChildrenSlotDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
