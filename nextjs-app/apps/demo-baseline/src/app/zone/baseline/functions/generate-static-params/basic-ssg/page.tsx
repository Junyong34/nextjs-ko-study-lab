import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/generate-static-params/basic-ssg')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProductCatalog } from './components/ProductCatalog'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="generateStaticParams 인기 상품 사전 SSG 빌드 생성"
        concept="generateStaticParams()가 반환한 BEST 상품 ID는 next build 시점에 미리 정적 HTML로 생성되고, 나머지 상품은 dynamicParams 기본값(true)에 따라 첫 요청 시 온디맨드로 생성됩니다."
        steps={[
          {
            step: 1,
            title: '[BEST 뱃지] 상품 카드 클릭',
            description: 'generateStaticParams() 목록에 포함된 상품 상세로 이동합니다.',
            actionBadge: '사전 SSG 상품',
          },
          {
            step: 2,
            title: '[일반 상품] 카드 클릭',
            description: 'generateStaticParams() 목록에 없는 상품 상세로 이동합니다.',
            actionBadge: '온디맨드 상품',
          },
          {
            step: 3,
            title: '두 유형의 판정 결과 비교',
            description: '이동한 페이지의 3단 검증 패널에서 사전 SSG 여부 판정과 근거를 확인합니다.',
            actionBadge: '판정 비교',
            observe: 'BEST 상품과 일반 상품의 params.productId 판정 결과 차이',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="generateStaticParams 인기 상품 사전 SSG 빌드 생성 실습">
        <ProductCatalog />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
