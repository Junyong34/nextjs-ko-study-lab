import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cache-tag/cascade-invalidation')

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { CatalogSection, CatalogSectionFallback } from './components/CatalogSection'
import { CascadeDeepDive } from './components/CascadeDeepDive'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="cacheTag 연쇄 무효화 (Cascade Invalidation)"
        concept="여러 'use cache' 엔트리에 상위·카테고리·상품 태그를 계층으로 부착해 두면, 무효화할 태그를 고르는 것만으로 재계산 범위가 정해집니다. 상위 태그는 전체를, 하위 태그는 해당 엔트리만 다시 계산합니다."
        steps={[
          {
            step: 1,
            title: '엔트리 7개의 cacheId와 태그 확인',
            description: '카탈로그 요약 1개, 카테고리 목록 2개, 상품 상세 4개가 각각 독립된 캐시 엔트리입니다. 카드 하단에 부착된 태그가 보입니다.',
            actionBadge: '구조 확인',
          },
          {
            step: 2,
            title: '상품 → 카테고리 → 상위 순서로 무효화',
            description: '버튼은 Server Action에서 updateTag()를 호출합니다. 좁은 태그부터 넓은 태그 순으로 눌러 봅니다.',
            actionBadge: 'updateTag 실행',
          },
          {
            step: 3,
            title: '재계산된 엔트리 범위 비교',
            description: 'cacheId가 바뀐 카드(재계산)와 그대로인 카드(유지)를 검증 패널의 기대 범위와 대조합니다.',
            actionBadge: '범위 검증',
            observe: '상품 태그 1개, 카테고리 태그 3개, 상위 태그 7개 엔트리의 cacheId가 바뀜',
            observeAt: 'playground',
          },
        ]}
      />
      <Suspense fallback={<CatalogSectionFallback />}>
        <CatalogSection />
      </Suspense>
      <CascadeDeepDive />
    </DemoContainer>
  )
}
