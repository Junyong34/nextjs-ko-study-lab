import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/component-jsx-cache')

import { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ObservationProvider } from './components/ObservationContext'
import { CategoryStage } from './components/CategoryStage'
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
        title="'use cache' 컴포넌트 JSX 렌더링 결과 캐싱"
        concept="컴포넌트 본문 첫 줄에 'use cache'를 두면 렌더 결과(JSX)가 props를 키로 캐시됩니다. children으로 넘긴 영역은 키에 들어가지 않고 매 요청 새로 렌더됩니다."
        steps={[
          {
            step: 1,
            title: '[같은 prop으로 다시 요청] 클릭',
            description: 'router.refresh()로 서버에 다시 요청합니다. 브라우저 새로고침(F5)으로 해도 됩니다.',
            actionBadge: '캐시 HIT',
            observe: '파란 영역의 렌더 시각·ID·실행 횟수는 그대로, 초록 children 슬롯의 요청 시각만 바뀜',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: 'category prop 버튼으로 다른 값 선택',
            description: 'searchParams로 받은 값을 캐시 컴포넌트에 category prop으로 넘깁니다.',
            actionBadge: '새 캐시 키',
            observe: '처음 보는 prop이면 새 렌더 ID와 "이 prop 실행 횟수 1회"가 표시됨',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '처음 category로 돌아가기',
            description: '이전 prop 값으로 다시 이동해 prop별 캐시 항목이 유지되는지 확인합니다.',
            actionBadge: '항목 재사용',
            observe: '1단계에서 본 렌더 ID가 다시 나타나고, 검증 패널이 "검증 완료"로 바뀜',
            observeAt: 'verification',
          },
        ]}
      />
      <ObservationProvider>
        <DemoPlaygroundCard title="CachedRankingPanel ('use cache') + children 슬롯">
          <Suspense
            fallback={<div className="h-64 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />}
          >
            <CategoryStage searchParams={searchParams} />
          </Suspense>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ObservationProvider>
      <ConceptDeepDive />
    </DemoContainer>
  )
}
