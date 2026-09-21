import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/revalidate-tag/basic-tag-purge')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidateTagBasicDemo } from './components/RevalidateTagBasicDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getInventoryCache } from './cachedData'

export default async function DemoPage() {
  const cache = await getInventoryCache()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="revalidateTag() 기본 무효화와 SWR"
        concept="revalidateTag('basic-tag-purge:inventory', 'max')를 호출하면 그 태그가 붙은 'use cache' 캐시가 stale로 표시됩니다. 액션 응답은 즉시 최신이지만, 캐시된 조회는 다음 방문에서야 새 값을 반영합니다(stale-while-revalidate)."
        steps={[
          {
            step: 1,
            title: "① 캐시된 조회 결과와 ② 액션 응답 초기 상태 확인",
            description: "두 패널이 같은 초기 재고 값을 보여주는 것을 확인합니다.",
            actionBadge: "초기 상태 확인",
          },
          {
            step: 2,
            title: "[revalidateTag('inventory', 'max') 실행] 클릭",
            description: "재고를 실제로 변경하고 inventory 태그가 붙은 캐시를 stale 상태로 표시합니다.",
            actionBadge: "태그 무효화",
          },
          {
            step: 3,
            title: "① 캐시된 조회가 ②를 따라잡는지 관찰",
            description: "액션 직후에는 ①이 아직 이전 값일 수 있습니다. 새로고침을 반복해 ①의 cacheId와 재고 값이 ②와 같아지는 시점을 관찰합니다.",
            actionBadge: "SWR 관찰",
            observe: "① 캐시된 조회의 cacheId·재고 값이 ②(액션 응답)와 같아짐",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"revalidateTag() 기본 무효화와 SWR 실습"}>
        <RevalidateTagBasicDemo cache={cache} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(cache.cacheId)}
        actual={`- 캐시 조회 cacheId: #${cache.cacheId}\n- 생성 시각: ${cache.generatedAt}`}
        expected="revalidateTag('basic-tag-purge:inventory', 'max') 실행 후 재방문하면 캐시된 조회의 cacheId와 재고 값이 액션 응답과 같아진다."
      />
    </DemoContainer>
  )
}
