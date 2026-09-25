import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/remote-redis-cache')

import { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ObservationProvider } from './components/ObservationContext'
import { RemoteStatsStage } from './components/RemoteStatsStage'
import { NestingRuleProbe } from './components/NestingRuleProbe'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="'use cache: remote' 분산 원격 캐시 계층 연동"
        concept="'use cache: remote'는 cacheComponents만 켜면 바로 쓸 수 있는 지시어지만, 실제로 원격(Redis 등) 저장소를 쓰려면 next.config.ts에 cacheHandlers.remote를 등록해야 한다. 등록하지 않으면 Next.js는 'remote'를 'default'와 같은 내장 in-memory 핸들러에 연결한다 — 이 데모는 그 사실을 Next.js 내부 레지스트리를 직접 읽어 실측한다."
        steps={[
          {
            step: 1,
            title: '[category / currency] 인자 바꾸기',
            description: 'use cache와 use cache: remote 두 지시어를 같은 인자로 나란히 호출한다.',
            actionBadge: '캐시 키 관측',
            observe: '두 지시어의 cacheId가 서로 다름(별도 캐시 키), 같은 인자로 재요청하면 remote 쪽도 HIT',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[내부 캐시 핸들러 레지스트리 실측] 카드 확인',
            description: "globalThis의 Next.js 내부 레지스트리를 읽어 'default'와 'remote' 핸들러가 같은 객체인지 확인한다.",
            actionBadge: '실측',
            observe: "cacheHandlers 미설정 시 Object.is(default, remote) = true",
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[실제로 실행해 에러 관측] 클릭',
            description: "'use cache: remote' 안에서 'use cache: private'를 호출해 중첩 금지 규칙을 실제로 위반시킨다.",
            actionBadge: '중첩 규칙',
            observe: 'Next.js가 던지는 실제 에러 이름·메시지가 3단 검증 패널에 그대로 나타남',
            observeAt: 'verification',
          },
        ]}
      />
      <ObservationProvider>
        <DemoPlaygroundCard title="getDefaultCategoryStats() / getRemoteCategoryStats() 호출 결과">
          <div className="space-y-3">
            <Suspense fallback={<div className="h-72 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />}>
              <RemoteStatsStage searchParams={searchParams} />
            </Suspense>
            <NestingRuleProbe />
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ObservationProvider>
    </DemoContainer>
  )
}
