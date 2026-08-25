import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NestedLayoutDemo } from './components/NestedLayoutDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"루트 및 중첩 layout.tsx 계층 구조와 상태 보존"}
        concept={"루트 레이아웃(app/layout.tsx)과 중첩 레이아웃(dashboard/layout.tsx)이 계층 트리를 구성하여, 자식 페이지 전환 시 상위 레이아웃의 DOM과 React 상태를 보존합니다."}
        steps={[
        {
        "step": 1,
        "title": "[탭 전환 (중첩)] 버튼 클릭",
        "description": "중첩 세그먼트 간의 경로 이동을 트리거합니다.",
        "actionBadge": "탭 전환"
        },
        {
        "step": 2,
        "title": "중첩 레이아웃 상태 유지 확인",
        "description": "하위 페이지가 교체되는 동안 상위 레이아웃의 입력값과 카운터가 리셋되지 않고 유지됩니다.",
        "actionBadge": "상태 보존"
        },
        {
        "step": 3,
        "title": "계층형 레이아웃 렌더링 검증",
        "description": "루트 레이아웃의 GNB와 중첩 레이아웃의 사이드바가 합성 렌더링되는 구조를 검증합니다.",
        "actionBadge": "계층 검증",
        "observe": "하위 탭 전환 시 상위 레이아웃의 인스턴스가 보존되며 3단 검증 패널에 정상 반영되는지 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"루트 레이아웃(Root Layout) 및 카테고리 중첩 레이아웃 실습"}>
        <NestedLayoutDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
