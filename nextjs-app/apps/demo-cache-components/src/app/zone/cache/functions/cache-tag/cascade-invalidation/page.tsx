import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cache-tag/cascade-invalidation')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheTagCascadeDemo } from './components/CacheTagCascadeDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getCategorySummaryCache, getProductListCache } from './cachedData'

export default async function DemoPage() {
  const category = await getCategorySummaryCache()
  const productList = await getProductListCache()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="cacheTag 연쇄 무효화 (Cascade Invalidation)"
        concept="서로 다른 두 'use cache' 함수가 같은 상위 태그(category)를 공유하면, 그 태그 하나를 revalidateTag로 무효화할 때 두 캐시 항목이 함께 stale이 됩니다."
        steps={[
          {
            step: 1,
            title: "카테고리·상품 목록 캐시의 cacheId 확인",
            description: "상품 목록 캐시 함수는 카테고리 요약 캐시 함수를 내부에서 호출하며, category 태그를 함께 등록합니다.",
            actionBadge: "초기 상태",
          },
          {
            step: 2,
            title: "[카테고리 태그로 무효화] 클릭",
            description: "상위 태그(cascade-invalidation:category)만 대상으로 revalidateTag를 호출합니다.",
            actionBadge: "연쇄 무효화",
          },
          {
            step: 3,
            title: "두 cacheId가 함께 바뀌는지 확인",
            description: "상품 목록 캐시도 category 태그를 공유하므로 함께 갱신됩니다. 반대로 [상품 태그로만 무효화]를 누르면 상품 cacheId만 바뀌고 카테고리 cacheId는 그대로입니다.",
            actionBadge: "결과 관찰",
            observe: "카테고리 태그 무효화 시 category·products cacheId가 모두 바뀌지만, 상품 태그 무효화 시 products cacheId만 바뀜",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"cacheTag 연쇄 무효화 (Cascade Invalidation) 실습"}>
        <CacheTagCascadeDemo category={category} productList={productList} />
      </DemoPlaygroundCard>
      <VerificationFooter category={category} productList={productList} />
    </DemoContainer>
  )
}
