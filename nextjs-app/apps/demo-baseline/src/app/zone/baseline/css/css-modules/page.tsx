import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CardA } from './components/CardA'
import { CardB } from './components/CardB'
import { VerificationFooter } from './components/VerificationFooter'

export default function CssModulesDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="CSS Modules 스코프 격리 & 해시 클래스 충돌 방지"
        concept="CSS Modules(.module.css)는 각 컴포넌트별로 고유한 해시 클래스명을 생성하여 로컬 스코프를 만듭니다. 서로 다른 파일에서 .card, .title 같은 동일한 클래스명을 선언해도 전역 오염 없이 안전하게 독립 스타일이 적용됩니다."
        steps={[
          {
            step: 1,
            title: '동일 클래스명 선언 구조 확인',
            description: 'CardA.module.css와 CardB.module.css가 모두 .card, .title 클래스를 사용합니다.',
            actionBadge: '클래스명 동일',
          },
          {
            step: 2,
            title: '독립 렌더링 결과 확인',
            description: 'Card A는 Blue 테마, Card B는 Emerald 테마가 각각 충돌 없이 격리 적용됩니다.',
            actionBadge: '스코프 격리',
          },
          {
            step: 3,
            title: '해시 클래스 네이밍 원리 학습',
            description: '하단 카드에서 Next.js가 빌드 시 컴포넌트별 고유 해시를 부여하는 방식을 학습합니다.',
            actionBadge: '빌드 타임 해싱',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="동일 클래스명(.card, .title, .badge) 충돌 격리 실습" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Card A 컴포넌트 */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              컴포넌트 1: CardA.tsx + CardA.module.css
            </div>
            <CardA />
          </div>

          {/* Card B 컴포넌트 */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              컴포넌트 2: CardB.tsx + CardB.module.css
            </div>
            <CardB />
          </div>
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
