import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/revalidate-tag/max-expiration')

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { PriceSection, PriceSectionFallback } from './components/PriceSection'
import { MaxExpirationDeepDive } from './components/MaxExpirationDeepDive'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="revalidateTag max 캐시 만료 제어"
        concept="revalidateTag(tag, profile)의 두 번째 인자는 무효화된 캐시를 '언제까지 이전 값으로 응답해도 되는지'(expire)를 정합니다. 'max'는 expire가 1년이라 무효화 후 첫 요청이 이전 값을 즉시 받고 백그라운드에서 재계산하며(SWR), { expire: 0 }은 즉시 만료라 첫 요청이 재계산을 기다려 새 값을 받습니다."
        steps={[
          {
            step: 1,
            title: "'max' 줄에서 [가격 변경 후 1·2회차 요청] 클릭",
            description: 'Route Handler가 원본 버전을 올리고 revalidateTag(tag, \'max\')를 호출한 뒤, 같은 캐시를 읽는 GET 요청을 두 번 보냅니다.',
            actionBadge: 'SWR',
          },
          {
            step: 2,
            title: '{ expire: 0 } 줄에서 같은 버튼 클릭',
            description: '1회차 요청이 이전 값 대신 새 버전을 받는지, 캐시 조회가 원본 지연(600ms)만큼 느려졌는지 봅니다.',
            actionBadge: '즉시 만료',
          },
          {
            step: 3,
            title: "'hours'와 { expire: 5 } 줄을 대기 0초·6초로 비교",
            description: '다른 프리셋도 expire가 길면 max와 같고, 커스텀 expire는 무효화 후 그 시간이 지나면 1회차부터 새 값을 받습니다.',
            actionBadge: 'expire 비교',
            observe: 'expire 안의 1회차 = 이전 cacheId(즉시), expire가 지난 1회차 = 새 cacheId(재계산 대기), 2회차는 모두 새 버전',
            observeAt: 'verification',
          },
        ]}
      />
      <Suspense fallback={<PriceSectionFallback />}>
        <PriceSection />
      </Suspense>
      <MaxExpirationDeepDive />
    </DemoContainer>
  )
}
