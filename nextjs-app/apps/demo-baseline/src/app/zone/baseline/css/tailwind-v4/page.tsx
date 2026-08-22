import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ThemeInspectorClient } from './components/ThemeInspectorClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function TailwindV4DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Tailwind CSS v4 유틸리티 클래스 & 반응형 스타일"
        concept="Tailwind CSS는 별도의 클래스명 고민 없이 유틸리티 클래스(p-4, bg-indigo-50, border, rounded-lg 등)의 조합으로 반응형 레이아웃과 다크모드를 빠르고 직관적으로 구축할 수 있게 해줍니다."
        steps={[
          {
            step: 1,
            title: '악센트 색상 변경 (Indigo / Emerald / Amber)',
            description: '상단 툴바에서 색상을 변경하여 카드의 테두리, 배경, 버튼 색상이 즉시 반응하는 것을 봅니다.',
            actionBadge: '유틸리티 클래스 조합',
          },
          {
            step: 2,
            title: '내부 여백 조절 (Compact / Normal / Spacious)',
            description: '패딩 크기 옵션을 눌러 p-3, p-4, p-6 클래스가 동적으로 적용되는 것을 확인합니다.',
            actionBadge: '디자인 토큰 스케일',
          },
          {
            step: 3,
            title: '하단 클래스 인스펙터 확인',
            description: '실제 DOM에 주입된 최종 유틸리티 클래스 문자열 목록을 확인합니다.',
            actionBadge: 'DOM 클래스 검증',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Tailwind v4 반응형 컴포넌트 실시간 조작 및 인스펙터" className="space-y-4">
        <ThemeInspectorClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
