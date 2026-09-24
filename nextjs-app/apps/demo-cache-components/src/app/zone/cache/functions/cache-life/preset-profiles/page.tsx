import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cache-life/preset-profiles')

import { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ObservationProvider } from './components/ObservationContext'
import { PresetBoard } from './components/PresetBoard'
import { VerificationFooter } from './components/VerificationFooter'
import { ConceptDeepDive } from './components/ConceptDeepDive'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="cacheLife 내장 프리셋 프로필 (seconds, hours, max)"
        concept="'use cache' 함수 안에서 cacheLife('seconds'), cacheLife('hours') 같은 내장 프리셋을 부르면 프리셋의 revalidate·expire 값에 따라 본문이 다시 실행되는 시점이 달라집니다."
        steps={[
          {
            step: 1,
            title: '처음 표시된 cacheId 확인',
            description: '네 개의 캐시 함수가 각자 다른 프리셋으로 cacheId와 본문 실행 시각을 기록합니다.',
            actionBadge: '초기 관측',
          },
          {
            step: 2,
            title: '2~3초 기다린 뒤 [서버에 다시 요청] 클릭',
            description: 'router.refresh()로 서버에 다시 요청합니다. 브라우저 새로고침(F5)으로 해도 됩니다. 몇 번 반복합니다.',
            actionBadge: 'revalidate 경과',
            observe: 'seconds 행의 cacheId·실행 횟수만 바뀌고 hours·max 행은 그대로',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '1분 이상 지난 뒤 한 번 더 요청',
            description: 'minutes 프리셋의 revalidate(1분)가 지나면 minutes 행도 바뀝니다.',
            actionBadge: '프리셋 비교',
            observe: '관측 기록 표에서 프리셋별 교체 시점이 갈리고, 검증 패널이 "검증 완료"로 바뀜',
            observeAt: 'verification',
          },
        ]}
      />
      <ObservationProvider>
        <DemoPlaygroundCard title="내장 프리셋별 'use cache' 함수 (cached.ts)">
          <Suspense fallback={<div className="h-56 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />}>
            <PresetBoard />
          </Suspense>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ObservationProvider>
      <ConceptDeepDive />
    </DemoContainer>
  )
}
