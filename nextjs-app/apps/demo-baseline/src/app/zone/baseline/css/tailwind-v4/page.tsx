import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ThemeInspectorClient } from './components/ThemeInspectorClient'

export default function TailwindV4DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Tailwind CSS v4 CSS-First 엔진 & 유틸리티 테마 스타일링"
        concept="Tailwind CSS v4의 @theme 지시어와 현대적 CSS 변수 엔진을 활용하여 별도 JavaScript 연산 없이 즉각적인 다크모드, 컬러 프리셋, 반응형 그리드/리스트 전환을 구현합니다."
        steps={[
          {
            step: 1,
            title: '@theme CSS 변수 기반 Tailwind v4 설정 및 클래스 확인',
            description: '최신 Tailwind CSS v4의 @theme 지시어와 하단 [조합된 Tailwind v4 유틸리티 클래스] 인스펙터를 확인합니다.',
            actionBadge: 'v4 테마 점검',
          },
          {
            step: 2,
            title: '[장바구니 담기] 버튼 클릭 및 인터랙션 실행',
            description: '유틸리티 클래스로 스타일링된 버튼을 클릭하여 활성 상태 스타일 변화를 테스트합니다.',
            actionBadge: '버튼 인터랙션',
          },
          {
            step: 3,
            title: '다크 모드 및 반응형 브레이크포인트 클래스 점검',
            description: '다크 테마 유틸리티와 반응형 그리드 클래스가 정상 적용되었는지 점검합니다.',
            actionBadge: '다크/반응형 점검',
          },
          {
            step: 4,
            title: 'Tailwind v4 런타임 제로 오버헤드 스타일 렌더링 관찰',
            description: '빌드 시점에 최적화된 최소 CSS 번들과 즉각적인 스타일 렌더링 성능을 관찰합니다.',
            actionBadge: 'CSS 최적화 관찰',
            observe: 'Tailwind v4 유틸리티 클래스가 순수 CSS 변수와 결합되어 제로 런타임 오버헤드로 즉각적인 UI 상태 변화를 렌더링함',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 */}
      <ThemeInspectorClient />
    </DemoContainer>
  )
}
