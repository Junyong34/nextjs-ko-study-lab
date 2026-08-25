import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { LayoutStatePreserveDemo } from './components/LayoutStatePreserveDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"중첩 레이아웃 클라이언트 상태 보존 (State Preservation)"}
        concept={"동일 레이아웃 세그먼트 내부에서 하위 경로를 이동해도 layout.tsx는 리렌더링되지 않고 React useState 입력값(검색창 입력 유지)을 보존하여 불필요한 상태 손실을 방지합니다."}
        steps={[
        {
        "step": 1,
        "title": "[검색창 입력 유지] 텍스트 수정",
        "description": "레이아웃 영역에 위치한 전역 검색 입력창의 텍스트를 변경하여 로컬 React 상태를 갱신합니다.",
        "actionBadge": "상태 변경"
        },
        {
        "step": 2,
        "title": "하위 세그먼트 페이지 전환",
        "description": "동일 layout 세그먼트 하위의 다른 서브 페이지로 이동합니다.",
        "actionBadge": "페이지 이동"
        },
        {
        "step": 3,
        "title": "레이아웃 상태 유지 확인",
        "description": "자식 페이지의 DOM은 교체되지만 상위 layout.tsx의 검색창 입력값은 유지되는 것을 확인합니다.",
        "actionBadge": "상태 유지",
        "observe": "서브 페이지 이동 후에도 레이아웃 입력값이 초기화되지 않고 3단 검증 패널에 보존 상태가 표시되는지 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"클라이언트 상태 보존 중첩 레이아웃 실습"}>
        <LayoutStatePreserveDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
