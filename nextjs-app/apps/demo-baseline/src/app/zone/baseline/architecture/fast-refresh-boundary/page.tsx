import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'architecture/fast-refresh-boundary')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StatePreservingCounter } from './components/StatePreservingCounter'
import { VerificationFooter } from './components/VerificationFooter'

export default function FastRefreshBoundaryDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title={"Fast Refresh 상태 보존 및 모듈 핫 리로딩 경계"}
        concept={"React Fast Refresh 메커니즘을 통해 컴포넌트 코드가 실시간 수정되어도 useState 카운터 상태를 안전하게 보존하고, export 구조 변경 시에만 경계를 초기화하여 0ms 개발 생산성을 제공합니다."}
        steps={[
          {
            step: 1,
            title: "[+1 수량 증가] 버튼 클릭으로 로컬 useState 상태 누적",
            description: "주문 수량을 증가시켜 메모리에 상태를 저장합니다.",
            actionBadge: "수량 누적",
          },
          {
            step: 2,
            title: "[배송 요청사항을 입력하세요] 입력 필드에 메모 작성",
            description: "폼 인풋 상태를 추가로 작성하여 다중 상태 보존 여부를 준비합니다.",
            actionBadge: "메모 작성",
          },
          {
            step: 3,
            title: "[🔄 비슷한 상황 시뮬레이션 (실제 HMR 아님)] 클릭",
            description: "Fast Refresh는 next dev 전용 기능이라 이 화면에서 실제로 재현할 수 없습니다. 코드 수정 후에도 상태가 유지되는 것과 비슷한 상황을 시뮬레이션합니다.",
            actionBadge: "유사 상황 시뮬레이션",
          },
          {
            step: 4,
            title: "시뮬레이션 이후에도 상태 보존 여부 관찰",
            description: "실제 HMR이 아니라 비슷한 상황을 만든 시뮬레이션이지만, 이 상호작용 이후에도 누적 수량과 배송 메모가 손실 없이 유지되는지 관찰합니다.",
            actionBadge: "상태 보존 관찰",
            observe: "유사 상황 시뮬레이션 이후에도 누적된 수량 및 입력 텍스트가 손실 없이 유지되는지 관찰",
            observeAt: "playground",
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Fast Refresh 인터랙티브 상태 보존 테스터" className="space-y-4">
        <StatePreservingCounter />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
