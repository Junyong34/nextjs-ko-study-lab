import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/generate-metadata/dynamic-title')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DynamicTitleInspector } from './components/DynamicTitleInspector'
import { VerificationFooter } from './components/VerificationFooter'
import { PRODUCTS } from './types'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="generateMetadata 동적 SEO 타이틀 및 메타태그 생성"
        concept="이 루트 페이지는 params 없이 항상 같은 정적 metadata를 씁니다. 아래 [상품 프리셋]을 클릭하면 실제로 /products/[productId] 라우트로 이동하고, 그 라우트가 export한 generateMetadata({ params })가 서버에서 상품마다 다른 title/description을 실제로 계산해 <head>에 반영합니다."
        steps={[
          {
            step: 1,
            title: "지금 이 페이지의 실제 <head> 인스펙터 확인",
            description: "params가 없는 정적 metadata 값이 그대로 반영된 것을 아래 인스펙터에서 확인합니다.",
            actionBadge: "정적 메타 확인",
          },
          {
            step: 2,
            title: "[트레일 러닝화 X1] 등 상품 프리셋 클릭 → 실제 페이지 이동",
            description: "실제 URL이 /products/running-shoes-001로 바뀌며, 그 세그먼트의 generateMetadata({ params })가 서버에서 실행됩니다.",
            actionBadge: "실제 라우트 이동",
          },
          {
            step: 3,
            title: "다른 상품 프리셋으로 계속 이동해 값 대조",
            description: "상품을 바꿔가며 실제 title/description이 매번 다시 계산되어 바뀌는지 인스펙터에서 대조합니다.",
            actionBadge: "동적 값 대조",
            observe: "3개 상품 프리셋을 오갈 때마다 실제 <title>과 meta description이 서로 다른 값으로 바뀜",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="상품 상세 generateMetadata 실습">
        <DynamicTitleInspector products={PRODUCTS} />
      </DemoPlaygroundCard>
      <VerificationFooter products={PRODUCTS} />
    </DemoContainer>
  )
}
