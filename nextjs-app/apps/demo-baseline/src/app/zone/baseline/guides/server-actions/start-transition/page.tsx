import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/server-actions/start-transition')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { StartTransitionSection } from './components/StartTransitionSection'
import { filterCategoryProductsAction } from './actions'

export default async function DemoPage() {
  const initialResult = await filterCategoryProductsAction('전체')

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="startTransition을 통한 프로그래밍 방식 Server Action 호출"
        concept="<form> 태그 없이 일반 버튼 클릭 이벤트에서 React 19 startTransition을 호출하면, 4000ms 비동기 Server Action 통신 중에도 메인 UI를 차단하지 않고 isPending 상태를 선언적으로 감지하여 로딩 인디케이터를 표시합니다."
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
            description: "startTransition(async () => { ... })을 호출하여 4000ms 비동기 트랜지션을 시작합니다.",
            actionBadge: "트랜지션 트리거",
          },
          {
            step: 3,
            title: "트랜지션 진행 중 논블로킹 입력창에 타이핑",
            description: "4000ms 서버 응답을 기다리는 동안 검색 입력창에 여유롭게 타이핑해 보고, 끊김 없이 입력되는지 확인해 메인 스레드가 차단되지 않음을 직접 체감합니다.",
            actionBadge: "논블로킹 확인",
            observe: "isPending이 true인 상태에서도 입력 지연 없이 타이핑되는지 관찰",
            observeAt: "playground",
          },
          {
            step: 4,
            title: "4000ms 후 결과 반영 및 검증 패널 확인",
            description: "isPending이 false로 전환되며 활성 탭 스타일(bg-zinc-900)이 바뀌고, 검증 패널에서 선택한 카테고리와 서버 응답이 일치하는지 확인합니다.",
            actionBadge: "일치 검증",
            observe: "selected 값과 서버 응답 result.category가 일치하는지, 검증 패널의 [검증 완료] 배지 확인",
            observeAt: "verification",
          },
        ]}
      />
      <StartTransitionSection initialResult={initialResult} />
    </DemoContainer>
  )
}
