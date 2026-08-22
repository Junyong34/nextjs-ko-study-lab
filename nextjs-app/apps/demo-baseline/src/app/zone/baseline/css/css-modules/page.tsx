import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProductCard } from './components/ProductCard'
import { PromotionBannerCard } from './components/PromotionBannerCard'
import { VerificationFooter } from './components/VerificationFooter'

export default function CssModulesDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="CSS Modules 스코프 격리 & 해시 클래스 충돌 방지"
        concept="CSS Modules(.module.css)는 각 컴포넌트별로 고유한 해시 클래스명을 생성하여 로컬 스코프를 만듭니다. 서로 다른 컴포넌트 파일에서 .card, .title, .badge, .action 같은 동일한 클래스명을 선언해도 전역 오염 없이 안전하게 독립 스타일이 적용됩니다."
        steps={[
          {
            step: 1,
            title: '동일 클래스명 선언 구조 확인',
            description: 'ProductCard.module.css와 PromotionBannerCard.module.css가 모두 .card, .title, .badge 클래스를 사용합니다.',
            actionBadge: '클래스명 동일',
          },
          {
            step: 2,
            title: '독립 렌더링 결과 확인',
            description: '상품 카드는 Blue 테마, 프로모션 배너는 Emerald 테마가 각각 충돌 없이 격리 적용됩니다.',
            actionBadge: '스코프 격리',
          },
          {
            step: 3,
            title: '해시 클래스 네이밍 원리 학습',
            description: 'Next.js 빌드 시 각 컴포넌트별 고유 해시(예: ProductCard_card__xxx)가 부여되어 스타일이 충돌하지 않습니다.',
            actionBadge: '빌드 타임 해싱',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="동일 클래스명(.card, .title, .badge, .action) 충돌 격리 실습" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 상품 카드 컴포넌트 */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              컴포넌트 1: ProductCard.tsx (표준 상품 카드)
            </div>
            <ProductCard />
          </div>

          {/* 프로모션 배너 컴포넌트 */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              컴포넌트 2: PromotionBannerCard.tsx (이벤트 배너)
            </div>
            <PromotionBannerCard />
          </div>
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
