import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/caching-legacy/fetch-cache')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { LegacyFetchCacheDemo } from './components/LegacyFetchCacheDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"레거시 fetch 캐시 옵션(force-cache vs no-store)"}
        concept={"Next.js App Router의 기본 fetch 확장 옵션인 { cache: 'force-cache' }와 { cache: 'no-store' }를 비교하여 영구 Data Cache 보관과 실시간 동적 패칭의 동작 차이를 실증합니다."}
        steps={[
          {
            step: 1,
            title: "[force-cache (영구 캐시)] 요청 실행",
            description: "Data Cache에 응답을 영구 보관하는 fetch 요청을 실행하고 응답 시간(0ms HIT)을 확인합니다.",
            actionBadge: "캐시 요청",
          },
          {
            step: 2,
            title: "[no-store (동적 실시간 패칭)] 요청 실행",
            description: "캐시를 우회하여 매 요청마다 원본 서버에서 최신 데이터를 가져오는 동작을 실행합니다.",
            actionBadge: "동적 요청",
          },
          {
            step: 3,
            title: "Data Cache HIT(0ms) vs MISS(네트워크 지연) 응답 대조",
            description: "두 요청 방식의 응답 타임스탬프와 캐시 헤더(HIT/MISS) 결과를 비교 검증합니다.",
            actionBadge: "캐시 대조",
            observe: "force-cache의 고정 타임스탬프(0ms HIT)와 no-store의 실시간 갱신 타임스탬프(MISS) 대조 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Next.js 14 레거시 fetch cache vs Route Segment revalidate 실습"}>
        <LegacyFetchCacheDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
