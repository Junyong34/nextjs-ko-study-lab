import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ThemeInspectorClient } from './components/ThemeInspectorClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function TailwindV4DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Tailwind CSS v4 CSS-First 엔진 & 유틸리티 테마 스타일링"
        concept="Tailwind CSS v4의 @theme 지시어와 현대적 CSS 변수 엔진을 활용하여 별도 JavaScript 연산 없이 0ms 즉각적인 다크모드, 컬러 프리셋, 반응형 그리드/리스트 전환을 구현합니다."
        steps={[
          {
            step: 1,
            title: '[장바구니 담기] 및 테마 버튼 클릭',
            description: '상단 테마 컨트롤러에서 다크모드 및 컬러 프리셋을 변경하고 [장바구니 담기] 버튼 스타일을 확인합니다.',
            actionBadge: '테마 전환',
          },
          {
            step: 2,
            title: '[로즈 (Rose)] 컬러 프리셋 클릭',
            description: '테마 색상에서 [로즈 (Rose)] 또는 [인디고 (Indigo)]를 클릭하여 OKLCH 기반 액센트 색상이 즉각 전파되는 것을 확인합니다.',
            actionBadge: '컬러 토큰 변경',
          },
          {
            step: 3,
            title: '[리스트 (List)] 뷰 모드 클릭',
            description: '[리스트 (List)] 및 [그리드 (Grid)] 버튼을 전환하며 컨테이너 쿼리와 반응형 유틸리티 클래스 레이아웃 변화를 관찰합니다.',
            actionBadge: '반응형 레이아웃',
            observe: 'Tailwind v4 유틸리티 클래스에 의해 다크모드, 컬러 토큰, 그리드/리스트 뷰가 0ms 즉시 화면에 반영됨',
            observeAt: 'playground',
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
