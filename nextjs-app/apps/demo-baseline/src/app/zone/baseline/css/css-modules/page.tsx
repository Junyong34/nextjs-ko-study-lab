import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { CssModulesController } from './components/CssModulesController'

export default function CssModulesDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js CSS Modules 컴포넌트 스코프 격리 & 고유 클래스 해시"
        concept="동일한 클래스명(.card, .title, .badge, .action)을 사용하더라도 Next.js App Router 빌드 엔진이 [name]_[local]__[hash] 형태의 고유 해시 클래스를 자동 생성하여 전역 오염 0건의 완벽한 스타일 격리를 보장합니다."
        steps={[
          {
            step: 1,
            title: '동일 클래스명(.card) 독립 컴포넌트 렌더링 확인',
            description: 'ProductCard와 PromotionBannerCard가 동일한 .card, .title, .badge, .action 클래스를 사용함에도 독립된 배경색과 스타일로 렌더링된 것을 확인합니다.',
            actionBadge: '스코프 격리 확인',
          },
          {
            step: 2,
            title: '[장바구니 담기] 및 [할인쿠폰 즉시 받기] 버튼 인터랙션',
            description: '각 카드의 액션 버튼을 클릭하여 독립된 컴포넌트 스코프 상태 변경을 확인합니다.',
            actionBadge: '컴포넌트 인터랙션',
          },
          {
            step: 3,
            title: '컴포넌트별 고유 해시 클래스 구조 관찰',
            description: 'CSS Modules가 생성한 [name]_[local]__[hash] 형태의 고유 클래스 스코프 분리를 대조 관찰합니다.',
            actionBadge: '해시 격리 검증',
            observe: 'ProductCard와 PromotionBannerCard가 동일한 .card, .action 클래스를 사용해도 독립된 스타일로 격리 렌더링됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 */}
      <CssModulesController />
    </DemoContainer>
  )
}
