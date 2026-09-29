import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/revalidate-path/dynamic-route')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidatePathDynamicDemo } from './components/RevalidatePathDynamicDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getProductCache } from './cachedData'
import { PRODUCT_ID_A, PRODUCT_ID_B } from './paths'

export default async function DemoPage() {
  const [productA, productB] = await Promise.all([
    getProductCache(PRODUCT_ID_A),
    getProductCache(PRODUCT_ID_B),
  ])

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="다이나믹 라우트 세그먼트의 revalidatePath 무효화 범위"
        concept="revalidatePath('/products/[id]', 'page')는 [id]에 바인딩되는 모든 상품 인스턴스를 무효화하고, revalidatePath('/products/1')처럼 실제 값이 채워진 리터럴 경로는 그 인스턴스 하나만 무효화합니다. 형제 데모 'page vs layout'이 고정 경로에서 페이지 단위 vs 레이아웃 단위(스코프 깊이)를 비교한다면, 이 데모는 다이나믹 세그먼트에서 패턴 전체 vs 특정 인스턴스(스코프 너비)라는 다른 축을 비교합니다."
        steps={[
          {
            step: 1,
            title: '상품 #1·#2 초기 cacheId 확인',
            description: '실습화면에 나란히 표시된 두 상품(products/1, products/2)의 cacheId를 확인합니다. 아래 링크로 실제 서브 라우트를 열어봐도 같은 값이 보입니다.',
            actionBadge: '초기 상태 확인',
          },
          {
            step: 2,
            title: "'상품 #1만 무효화' 클릭 후 재확인",
            description: "revalidatePath('/…/products/1')을 실행합니다. 상품 #1의 cacheId만 바뀌고 상품 #2는 그대로인지 확인합니다.",
            actionBadge: '인스턴스 무효화 실행',
          },
          {
            step: 3,
            title: "'패턴 전체 무효화' 클릭 후 재확인",
            description: "revalidatePath('/…/products/[id]', 'page')를 실행합니다. 상품 #1, #2의 cacheId가 함께 바뀌는지 확인합니다.",
            actionBadge: '패턴 무효화 실행',
            observe: "리터럴 경로는 지정한 인스턴스 하나만, 다이나믹 패턴은 그 패턴과 일치하는 모든 인스턴스를 함께 무효화함",
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title="다이나믹 라우트 세그먼트의 revalidatePath 무효화 범위 실습">
        <RevalidatePathDynamicDemo productA={productA} productB={productB} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(productA.cacheId && productB.cacheId)}
        actual={`- 상품 #1 cacheId: #${productA.cacheId}\n- 상품 #2 cacheId: #${productB.cacheId}`}
        expected="인스턴스 무효화는 상품 #1의 cacheId만 바꾸고, 패턴 무효화는 상품 #1·#2의 cacheId를 모두 바꾼다."
      />
    </DemoContainer>
  )
}
