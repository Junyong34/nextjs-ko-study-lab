import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cache-life/custom-profile')

import { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ObservationProvider } from './components/ObservationContext'
import { ProfileBoard } from './components/ProfileBoard'
import { VerificationFooter } from './components/VerificationFooter'
import { ConceptDeepDive } from './components/ConceptDeepDive'
import { CUSTOM_PROFILE_NAME } from './types'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next.config.ts에서 custom cacheLife 프로필 정의 및 바인딩"
        concept={`next.config.ts의 cacheLife 객체에 새 이름('${CUSTOM_PROFILE_NAME}')의 커스텀 프로필을 정의하고, 컴포넌트 안에서 cacheLife(그 이름)을 호출하면 stale·revalidate·expire가 실제로 그 값으로 바뀝니다. 옆에는 cacheLife()를 아예 호출하지 않은 default 대조군을 나란히 둡니다.`}
        steps={[
          {
            step: 1,
            title: '처음 표시된 custom / default 두 행의 cacheId 확인',
            description: 'custom 행은 next.config.ts 커스텀 프로필(revalidate 4초)에, default 행은 cacheLife() 미호출(revalidate 15분)에 바인딩되어 있습니다.',
            actionBadge: '초기 관측',
          },
          {
            step: 2,
            title: '5초 이상 기다린 뒤 [서버에 다시 요청] 클릭',
            description: 'router.refresh()로 서버에 다시 요청합니다. 브라우저 새로고침(F5)으로 해도 됩니다. 몇 번 반복합니다.',
            actionBadge: 'revalidate 경과',
            observe: 'custom 행의 cacheId·실행 횟수만 바뀌고 default 행은 그대로',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널과 요청 기록 표 확인',
            description: 'custom 프로필이 실제로 4초 revalidate로 동작하는지, default 프로필은 15분 동안 그대로인지 대조합니다.',
            actionBadge: '결과 검증',
            observe: '검증 패널이 "검증 완료"로 바뀌고, 요청 기록 표에서 custom 열만 굵게 강조됨',
            observeAt: 'verification',
          },
        ]}
      />
      <ObservationProvider>
        <DemoPlaygroundCard title="커스텀/default cacheLife 바인딩 비교 (cached.ts)">
          <Suspense fallback={<div className="h-56 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />}>
            <ProfileBoard />
          </Suspense>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ObservationProvider>
      <ConceptDeepDive />
    </DemoContainer>
  )
}
