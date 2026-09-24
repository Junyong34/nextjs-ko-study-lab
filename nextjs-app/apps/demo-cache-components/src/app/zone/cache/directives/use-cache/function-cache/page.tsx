import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/function-cache')

import { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ObservationProvider } from './components/ObservationContext'
import { StatsStage } from './components/StatsStage'
import { VerificationFooter } from './components/VerificationFooter'
import { ConceptDeepDive } from './components/ConceptDeepDive'

export default function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="'use cache' 비동기 함수 결과 캐싱"
        concept="async 함수 본문 첫 줄에 'use cache'를 두면 반환값이 직렬화되어 저장됩니다. 캐시 키는 빌드 ID + 함수 ID + 직렬화된 인자라서, 같은 인자는 저장된 값을 돌려받고 다른 인자는 별도 항목이 만들어집니다."
        steps={[
          {
            step: 1,
            title: '[같은 인자로 다시 요청] 클릭',
            description: 'router.refresh()로 서버에 다시 요청합니다. 브라우저 새로고침(F5)으로 해도 됩니다.',
            actionBadge: '캐시 HIT',
            observe: '요청 ID·시각은 바뀌고, 호출 A·B의 cacheId·본문 실행 시각·실행 횟수는 그대로',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: 'category 또는 currency 인자 바꾸기',
            description: 'searchParams를 캐시 밖에서 읽어 getCategoryStats(category, { currency })의 인자로 넘깁니다.',
            actionBadge: '새 캐시 키',
            observe: '처음 보는 인자 조합이면 새 cacheId와 "이 인자 실행 횟수 1회". 호출 A·B는 같은 cacheId',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '처음 인자 조합으로 돌아가기',
            description: '다른 인자를 거쳐 처음 조합으로 돌아와 인자별 항목이 유지되는지 확인합니다.',
            actionBadge: '항목 재사용',
            observe: '1단계의 cacheId가 다시 나타나고 검증 패널이 "검증 완료"로 바뀜',
            observeAt: 'verification',
          },
        ]}
      />
      <ObservationProvider>
        <DemoPlaygroundCard title="getCategoryStats() ('use cache') 호출 결과">
          <Suspense fallback={<div className="h-72 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />}>
            <StatsStage searchParams={searchParams} />
          </Suspense>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ObservationProvider>
      <ConceptDeepDive />
    </DemoContainer>
  )
}
