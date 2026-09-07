import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/server-and-client-boundary/children-slot')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ChildrenSlotDemo } from './components/ChildrenSlotDemo'
import { ServerInjectedPanel } from './components/ServerInjectedPanel'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const renderId = Math.random().toString(36).slice(2, 8).toUpperCase()
  const generatedAt = new Date().toLocaleTimeString('ko-KR', { hour12: false })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Children Slot 패턴을 통한 RSC와 RCC 합성"}
        concept={"Client Component(RCC) 내부에 Server Component(RSC)를 직접 import하지 않고 children props 슬롯으로 전달하면, RCC가 로컬 상태로 몇 번을 리렌더링해도 주입된 RSC는 서버에서 렌더링된 결과 그대로 유지됩니다."}
        steps={[
          {
            step: 1,
            title: "[리렌더링 트리거] 버튼 클릭",
            description: "클라이언트 컴포넌트의 로컬 상태(카운터)를 변경해 리렌더링을 유도합니다.",
            actionBadge: "RCC 상태 변경",
          },
          {
            step: 2,
            title: "[슬롯 접기 / 슬롯 펼치기] 버튼 클릭",
            description: "children으로 주입된 서버 컴포넌트 블록을 감췄다가 다시 표시합니다.",
            actionBadge: "RCC 리렌더링",
          },
          {
            step: 3,
            title: "children 블록의 renderId 변화 여부 관찰",
            description: "리렌더링 횟수가 올라가도 children 블록에 표시된 renderId와 참조 동일성 문구가 그대로인지 확인합니다.",
            actionBadge: "합성 검증",
            observe: "RCC를 여러 번 리렌더링해도 children으로 주입된 RSC의 renderId가 바뀌지 않고, '참조 동일성: 유지됨'이 계속 표시되는지 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Server and Client Component 합성과 children 슬롯 주입 실습"}>
        <ChildrenSlotDemo>
          <ServerInjectedPanel renderId={renderId} generatedAt={generatedAt} />
        </ChildrenSlotDemo>
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(renderId)}
        actual={`- renderId: ${renderId}\n- generatedAt: ${generatedAt}\n- 이 값은 RCC가 몇 번 리렌더링되어도 바뀌지 않습니다.`}
        expected="children으로 주입된 Server Component의 renderId는 RCC의 로컬 상태 변경(리렌더링)과 무관하게 항상 동일하게 유지되어야 한다."
      />
    </DemoContainer>
  )
}
