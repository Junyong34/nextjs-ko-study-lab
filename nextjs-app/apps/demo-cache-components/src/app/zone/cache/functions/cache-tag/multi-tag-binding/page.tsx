import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cache-tag/multi-tag-binding')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheTagMultiBindingDemo } from './components/CacheTagMultiBindingDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getProductDetailCache } from './cachedData'

export default async function DemoPage() {
  const product = await getProductDetailCache()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="cacheTag 다중 태그 바인딩 및 연관 캐시 구성"
        concept="cacheTag() 함수에 여러 문자열을 전달하면 하나의 캐시 항목에 여러 태그를 동시에 등록할 수 있습니다. 등록된 태그 중 어느 하나만 무효화해도 그 캐시 항목 전체가 무효화됩니다."
        steps={[
          {
            step: 1,
            title: "다중 태그가 바인딩된 상품 캐시 확인",
            description: "상품 상세 캐시 하나에 상품·카테고리·브랜드 태그 3개가 함께 등록된 것을 확인합니다.",
            actionBadge: "태그 구조 점검",
          },
          {
            step: 2,
            title: "태그 3개 중 하나를 선택해 무효화",
            description: "'상품 태그로 무효화' / '카테고리 태그로 무효화' / '브랜드 태그로 무효화' 버튼 중 하나를 눌러 revalidateTag()를 실행합니다.",
            actionBadge: "태그 무효화 실행",
          },
          {
            step: 3,
            title: "새로고침 후 cacheId 변화 관찰",
            description: "어느 태그를 눌렀든 같은 상품 캐시의 cacheId가 바뀌는지 확인합니다 — 세 태그가 같은 캐시 항목을 가리키기 때문입니다.",
            actionBadge: "결과 관찰",
            observe: "버튼 클릭 후 cacheId가 이전 값과 달라짐",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"cacheTag 다중 태그 바인딩 및 연관 캐시 구성 실습"}>
        <CacheTagMultiBindingDemo product={product} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(product.cacheId)}
        actual={`- ${product.productName} cacheId: #${product.cacheId}\n- 생성 시각: ${product.generatedAt}`}
        expected="상품·카테고리·브랜드 태그 중 어느 것을 무효화해도 같은 상품 캐시의 cacheId가 바뀐다."
      />
    </DemoContainer>
  )
}
