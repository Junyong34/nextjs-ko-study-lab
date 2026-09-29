import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cache-life/preset-profiles')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheLifePresetsDemo } from './components/CacheLifePresetsDemo'
import { VerificationFooter } from './components/VerificationFooter'
import {
  getSecondsPresetSnapshot,
  getHoursPresetSnapshot,
  getMaxPresetSnapshot,
} from './cachedData'

// cacheLife('seconds') 프로필의 정적 셸 프리렌더가 빌드 타임에 실패해(blocking-prerender-runtime)
// 정적 셸 없이 매 요청 시 렌더한다. 'use cache' 자체의 서버 캐싱 동작에는 영향이 없다.
export const instant = false

export default async function DemoPage() {
  const [seconds, hours, max] = await Promise.all([
    getSecondsPresetSnapshot(),
    getHoursPresetSnapshot(),
    getMaxPresetSnapshot(),
  ])

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="cacheLife 내장 프리셋 프로필 (seconds, hours, max)"
        concept="cacheLife('seconds') / ('hours') / ('max')은 각각 실제로 다른 'use cache' 함수에 선언된, 서로 다른 stale/revalidate/expire 초 값을 가진 Next.js 내장 프리셋입니다. seconds는 revalidate가 1초라 새로고침마다 거의 매번 캐시가 교체되고, hours/max는 revalidate가 1시간/30일이라 짧은 실습 세션 내내 캐시 ID가 그대로 유지되는 것이 정상입니다."
        steps={[
          {
            step: 1,
            title: '세 프리셋의 초기 캐시 ID·생성 시각 확인',
            description: "seconds/hours/max 각각 실제 'use cache' 함수가 반환한 캐시 ID와 생성 시각을 확인합니다.",
            actionBadge: '초기 상태 확인',
          },
          {
            step: 2,
            title: '[전체 새로고침]을 1초 이상 간격으로 2~3회 클릭',
            description:
              "cacheLife('seconds')는 revalidate가 1초이므로, 클릭 간격이 1초를 넘으면 새로고침할 때마다 seconds 카드의 캐시 ID와 생성 시각이 거의 매번 바뀝니다.",
            actionBadge: 'seconds 재계산 관찰',
          },
          {
            step: 3,
            title: '같은 새로고침을 반복하며 hours/max 카드 관찰',
            description:
              "cacheLife('hours')는 revalidate 1시간, cacheLife('max')는 revalidate 30일이므로 실습 세션(수 분) 동안 캐시 ID가 바뀌지 않는 것 자체가 정상 동작입니다.",
            actionBadge: '장기 캐시 유지 확인',
            observe:
              'seconds 카드는 새로고침마다 캐시 ID·생성 시각이 바뀌고, hours/max 카드는 세션 내내 값이 고정된다',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title="cacheLife 내장 프리셋 프로필 (seconds, hours, max) 실습">
        <CacheLifePresetsDemo seconds={seconds} hours={hours} max={max} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(seconds.cacheId && hours.cacheId && max.cacheId)}
        actual={`- seconds #${seconds.cacheId} (${seconds.generatedAt}) → stale 30초 / revalidate 1초 / expire 1분\n- hours #${hours.cacheId} (${hours.generatedAt}) → stale 5분 / revalidate 1시간 / expire 1일\n- max #${max.cacheId} (${max.generatedAt}) → stale 5분 / revalidate 30일 / expire 1년`}
        expected="새로고침을 반복하면 seconds 카드의 캐시 ID·생성 시각은 (1초 이상 간격이면) 거의 매번 바뀌고, hours/max 카드는 이 세션 동안 그대로 유지된다."
      />
    </DemoContainer>
  )
}
