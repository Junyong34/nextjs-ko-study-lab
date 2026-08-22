import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FontPreviewClient } from './components/FontPreviewClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function FontOptimizationDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="next/font 자동 셀프호스팅 & Zero CLS 폰트 로딩"
        concept="next/font는 Google Fonts 및 로컬 WOFF2 폰트를 애플리케이션과 함께 자동 셀프호스팅하여 외부 DNS 요청을 제거하고, size-adjust CSS 보정을 통해 폰트 로딩 중 레이아웃 흔들림(CLS)을 완벽하게 방지합니다."
        steps={[
          {
            step: 1,
            title: '3대 폰트 로딩 방식 대조',
            description: '외부 CDN 링크 방식과 next/font의 셀프호스팅 및 로컬 폰트 적용 방식을 비교합니다.',
            actionBadge: '셀프호스팅 비교',
          },
          {
            step: 2,
            title: '굵기(weight) 및 문구 변경',
            description: '상단 툴바에서 폰트 굵기를 400, 700, 900으로 변경하고 실시간 렌더링을 확인합니다.',
            actionBadge: '가변 폰트 제어',
          },
          {
            step: 3,
            title: 'Zero CLS 원리 학습',
            description: '하단 개념 정리 카드에서 size-adjust 및 서브셋 최적화 메커니즘을 학습합니다.',
            actionBadge: 'Zero CLS 원리',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Next.js 웹 폰트 로딩 및 렌더링 시뮬레이터" className="space-y-4">
        <FontPreviewClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
