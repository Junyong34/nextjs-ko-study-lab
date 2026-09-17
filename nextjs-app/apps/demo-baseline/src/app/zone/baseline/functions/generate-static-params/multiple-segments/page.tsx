import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/generate-static-params/multiple-segments')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { GenerateStaticParamsMultiDemo } from './components/GenerateStaticParamsMultiDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="generateStaticParams [category]/[id] 다중 세그먼트 조합"
        concept="[category]/[id]처럼 두 단계로 중첩된 동적 세그먼트에서는 상위 layout.tsx의 generateStaticParams()가 먼저 카테고리를 정하고, 하위 page.tsx의 generateStaticParams()가 그 카테고리를 params로 넘겨받아 상품 id를 채웁니다. 두 함수가 모두 반환한 category+id 조합만 next build 시점에 사전 SSG되고, 나머지는 실제로 유효하면 온디맨드로, 무효하면 진짜 404로 처리됩니다."
        steps={[
          {
            step: 1,
            title: '[사전 SSG 조합] 카드 클릭',
            description: '상위·하위 generateStaticParams()가 모두 반환한 category+id 조합으로 이동합니다.',
            actionBadge: '사전 SSG',
          },
          {
            step: 2,
            title: '[유효하지만 온디맨드] 카드 클릭',
            description: '카테고리·상품은 실존하지만 generateStaticParams() 목록 밖인 조합으로 이동합니다.',
            actionBadge: '온디맨드',
          },
          {
            step: 3,
            title: '[잘못된 조합] 카드 클릭',
            description: '존재하지 않는 카테고리·id 또는 category-id 불일치 조합으로 이동해 실제 404를 확인합니다.',
            actionBadge: '404 확인',
            observe: '세 조합 유형에서 3단 검증 패널의 판정이 어떻게 달라지는지, 그리고 실제 404 페이지',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="상품 카탈로그 (실제 경로: shop/[category]/[id])">
        <GenerateStaticParamsMultiDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
