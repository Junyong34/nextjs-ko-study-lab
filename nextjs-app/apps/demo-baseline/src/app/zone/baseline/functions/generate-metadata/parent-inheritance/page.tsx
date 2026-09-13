import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/generate-metadata/parent-inheritance')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InheritanceInspector } from './components/InheritanceInspector'
import { VerificationFooter } from './components/VerificationFooter'
import { PRODUCTS } from './types'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="부모 metadata 상속 및 canonical URL 오버라이드"
        concept="이 인덱스 페이지의 openGraph는 형제 layout.tsx가 정의한 값을 통째로 덮어씁니다. 반면 아래 [상품 프리셋]으로 이동하면, 그 라우트의 generateMetadata(props, parent: ResolvingMetadata)는 title/alternates.canonical만 반환하고 openGraph는 반환하지 않아, layout.tsx의 openGraph가 그대로 상속됩니다."
        steps={[
          {
            step: 1,
            title: '지금 이 인덱스 페이지의 실제 <head> 인스펙터 확인',
            description: '인덱스는 자체 openGraph를 반환하므로 og:site_name이 아예 없는 것을 아래 인스펙터에서 확인합니다.',
            actionBadge: '교체 확인',
          },
          {
            step: 2,
            title: '[상품 프리셋] 클릭 → 실제 /products/[productId] 라우트로 이동',
            description:
              '실제 URL이 /products/wireless-earbuds-101 등으로 바뀌며, 그 라우트의 generateMetadata(props, parent)가 서버에서 실행됩니다.',
            actionBadge: '실제 라우트 이동',
          },
          {
            step: 3,
            title: '다른 상품 프리셋으로 계속 이동해 대조',
            description: '상품을 바꿔가며 title/canonical만 다시 바뀌고, og:site_name/og:image는 두 상품에서 완전히 동일한지 인스펙터에서 대조합니다.',
            actionBadge: '상속·교체 대조',
            observe: 'title·canonical은 상품마다 바뀌지만 og:site_name·og:image는 layout.tsx 선언값 그대로 유지됨',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title="부모 metadata 상속 및 canonical URL 오버라이드 실습">
        <InheritanceInspector products={PRODUCTS} />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
