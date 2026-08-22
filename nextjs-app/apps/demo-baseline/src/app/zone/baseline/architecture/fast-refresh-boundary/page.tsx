import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StatePreservingCounter } from './components/StatePreservingCounter'
import { VerificationFooter } from './components/VerificationFooter'

export default function FastRefreshBoundaryDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="React Fast Refresh & 핫 모듈 리로딩 (HMR) 상태 보존"
        concept="Next.js의 React Fast Refresh는 개발 중 컴포넌트 코드가 변경되었을 때 전체 페이지를 리로드하지 않고 수정된 컴포넌트만 실시간으로 패치하여, 장바구니 수량이나 입력 폼의 상태를 완벽히 유지합니다."
        steps={[
          {
            step: 1,
            title: '수량 증감 및 메모 텍스트 입력',
            description: '카운터를 15개로 늘리고 인풋 텍스트를 원하는 문구로 수정합니다.',
            actionBadge: 'React State 설정',
          },
          {
            step: 2,
            title: '컴포넌트 핫 리로딩 상태 보존 확인',
            description: '컴포넌트 수정 시에도 초기 마운트 시각과 입력 데이터가 날아가지 않는 것을 확인합니다.',
            actionBadge: 'Fast Refresh 보존',
          },
          {
            step: 3,
            title: '상태 보존 규칙과 리마운트 조건 학습',
            description: '하단 개념 정리에서 Fast Refresh가 상태를 보존하기 위한 올바른 export 규칙을 확인합니다.',
            actionBadge: 'HMR 아키텍처',
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
