import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StartTransitionDemo } from './components/StartTransitionDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { filterCategoryProductsAction } from './actions'

export default async function DemoPage() {
  const initialResult = await filterCategoryProductsAction('전체')

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="startTransition을 통한 프로그래밍 방식 Server Action 호출"
        concept="<form> 태그 없이 일반 버튼 클릭 이벤트에서 React 19 startTransition을 호출하면, 600ms 비동기 Server Action 통신 중에도 메인 UI를 차단하지 않고 isPending 상태를 선언적으로 감지하여 로딩 인디케이터를 표시합니다."
        steps={[
          {
            step: 1,
            title: "[전체] 기본 탭 선택 상태 확인",
            description: "초기 렌더링 시 기본 카테고리가 선택되어 있고 isPending이 false 상태임을 확인합니다.",
            actionBadge: "초기 탭 점검",
          },
          {
            step: 2,
            title: "[전자기기] 또는 [의류] 카테고리 탭 버튼 클릭",
            description: "startTransition(async () => { ... })을 호출하여 600ms 비동기 트랜지션을 시작합니다.",
            actionBadge: "트랜지션 트리거",
          },
          {
            step: 3,
            title: "600ms 동안 서버 트랜지션 처리 중... 인디케이터 표시 관찰",
            description: "isPending 플래그가 활성화되어 파란색 애니메이션 텍스트가 표시되고 600ms 후 활성 탭 스타일(bg-zinc-900)이 전환되는 결과를 확인합니다.",
            actionBadge: "상태 반영 완료",
            observe: "600ms 동안의 isPending 인디케이터 표시 및 선택된 카테고리 탭의 활성 배경 스타일(bg-zinc-900) 적용 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="startTransition을 통한 프로그래밍 방식 Server Action 호출 실습">
        <StartTransitionDemo initialResult={initialResult} />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
