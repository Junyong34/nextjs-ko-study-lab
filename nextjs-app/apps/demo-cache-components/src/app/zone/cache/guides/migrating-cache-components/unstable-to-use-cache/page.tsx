import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'guides/migrating-cache-components/unstable-to-use-cache')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MigrateCacheDemo } from './components/MigrateCacheDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getLegacyCachedProduct, getModernCachedProduct } from './cachedData'

export default async function DemoPage() {
  const [legacy, modern] = await Promise.all([getLegacyCachedProduct(), getModernCachedProduct()])

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"unstable_cache에서 use cache 지시어로의 현대화 마이그레이션"}
        concept={"복잡한 키 배열과 함수 래핑이 필요했던 레거시 unstable_cache()와 선언적 'use cache' 지시어를 같은 상품에 대해 실제로 각각 호출해, 두 결과가 똑같이 캐시로 유지되는지 직접 대조합니다."}
        steps={[
          {
            step: 1,
            title: "레거시 unstable_cache 결과와 모던 use cache 결과의 캐시 ID 확인",
            description: "두 캐싱 방식이 각각 반환한 캐시 ID와 생성 시각을 확인합니다.",
            actionBadge: "레거시·모던 점검",
          },
          {
            step: 2,
            title: "[새로고침] 반복 클릭",
            description: "두 캐시 ID가 모두 그대로 유지되는지 확인합니다 — 두 방식 모두 실제로 캐시되고 있다는 증거입니다.",
            actionBadge: "캐시 HIT 대조",
          },
          {
            step: 3,
            title: "[레거시만 무효화] 또는 [모던만 무효화] 클릭 후 새로고침",
            description: "한쪽만 revalidateTag로 무효화하면 그 캐시 ID만 바뀌고 나머지는 유지되는지 검증합니다.",
            actionBadge: "마이그레이션 검증",
            observe: "레거시/모던 무효화 버튼 각각이 대응하는 캐시 ID만 독립적으로 교체하는 결과 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"unstable_cache에서 Next.js 16 use cache로 마이그레이션 실습"}>
        <MigrateCacheDemo legacy={legacy} modern={modern} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(legacy.cacheId && modern.cacheId)}
        actual={`- unstable_cache 캐시 ID: #${legacy.cacheId} (${legacy.generatedAt})\n- use cache 캐시 ID: #${modern.cacheId} (${modern.generatedAt})`}
        expected="두 방식 모두 같은 상품 데이터를 캐시하며, 재요청 시 각자의 캐시 ID를 독립적으로 유지·무효화한다."
      />
    </DemoContainer>
  )
}
