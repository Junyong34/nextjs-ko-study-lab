import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/component-jsx-cache')

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import {
  BestSellerRankingHero,
  DirectiveUseCacheComponentDemo,
  normalizeCategory,
} from './components/DirectiveUseCacheComponentDemo'
import { VerificationFooter } from './components/VerificationFooter'

type SearchParams = Promise<{ category?: string }>

async function ComponentCacheContent({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const category = normalizeCategory(sp.category)
  const { hero, renderId, renderedAt } = await BestSellerRankingHero({ category })

  return (
    <>
      <DemoPlaygroundCard title={"'use cache' 컴포넌트 JSX 렌더링 결과 캐싱 실습"}>
        <DirectiveUseCacheComponentDemo category={category} hero={hero} />
      </DemoPlaygroundCard>
      <VerificationFooter category={category} renderId={renderId} renderedAt={renderedAt} />
    </>
  )
}

export default function DemoPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use cache' 컴포넌트 단위 JSX 렌더링 캐시"}
        concept={
          "비동기 서버 컴포넌트 함수 자체에 'use cache'를 선언하면 그 함수가 반환하는 JSX 트리 전체가 인자(props) 값별로 캐시됩니다. 같은 카테고리를 다시 선택하면 컴포넌트 본문이 재실행되지 않고 캐시된 JSX가 그대로 반환됩니다."
        }
        steps={[
          {
            step: 1,
            title: '카테고리 탭 선택',
            description: "'use cache'가 적용된 BestSellerRankingHero 컴포넌트에 category 인자를 전달해 렌더링합니다.",
            actionBadge: '컴포넌트 렌더링',
          },
          {
            step: 2,
            title: '동일 카테고리 재선택',
            description:
              '같은 category로 다시 이동하면 컴포넌트 함수가 재실행되지 않고 캐시된 renderId가 그대로 재사용되는지 확인합니다.',
            actionBadge: 'JSX 캐시 HIT',
            observe: '3단 검증 패널에서 renderId/renderedAt이 이전 방문과 동일한지 대조',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '다른 카테고리로 전환',
            description: '처음 방문하는 category는 새 인자 조합이므로 캐시 MISS가 발생해 renderId가 새로 생성됩니다.',
            actionBadge: '캐시 MISS',
          },
        ]}
      />
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-zinc-400 font-mono animate-pulse">
            [대기] 컴포넌트 JSX 캐시 로딩 중...
          </div>
        }
      >
        <ComponentCacheContent searchParams={searchParams} />
      </Suspense>
    </DemoContainer>
  )
}
