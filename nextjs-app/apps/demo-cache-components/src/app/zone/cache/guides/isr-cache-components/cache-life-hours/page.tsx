import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'guides/isr-cache-components/cache-life-hours')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheLifeHoursDemo } from './components/CacheLifeHoursDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getHeroBannerCache } from './cachedData'

export default async function DemoPage() {
  const banner = await getHeroBannerCache()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={'Cache Components의 cacheLife 프로필 기반 정적 캐싱'}
        concept={
          "Next.js 16의 'use cache' 지시어와 cacheLife('hours') 프로필을 선언하면 stale(5분), revalidate(1시간), expire(1일) 수명 주기가 자동 적용됩니다. 새로고침해도 캐시 ID가 그대로면 실제 캐시가 재사용되고 있다는 증거입니다."
        }
        steps={[
          {
            step: 1,
            title: "cacheLife('hours')로 캐시된 배너의 캐시 ID·생성 시각 확인",
            description: '최초 렌더링 시 캐시된 배너의 캐시 ID와 생성 시각을 확인합니다.',
            actionBadge: '초기 상태 확인',
          },
          {
            step: 2,
            title: '[새로고침] 반복 클릭',
            description: '여러 번 새로고침해도 캐시 ID가 그대로인지 확인합니다 — use cache가 재계산 없이 캐시를 재사용하는 증거입니다.',
            actionBadge: '캐시 HIT 확인',
          },
          {
            step: 3,
            title: '[강제 무효화 (revalidateTag)] 클릭 후 새로고침',
            description: 'cacheTag로 태그된 캐시를 revalidateTag로 무효화한 뒤 새로고침하면 새 캐시 ID로 교체되는지 확인합니다.',
            actionBadge: '무효화 검증',
            observe: '무효화 전에는 캐시 ID가 고정되고, 무효화 후 새로고침에서만 캐시 ID가 바뀌는 결과 관찰',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title={"Next.js 16 cacheLife('hours') 프로필 기반 수명 제어 실습"}>
        <CacheLifeHoursDemo banner={banner} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(banner.cacheId)}
        actual={`- 캐시 ID: #${banner.cacheId}\n- 생성 시각: ${banner.cachedAt}\n- 프로필: cacheLife('hours') → stale 5분 / revalidate 1시간 / expire 1일`}
        expected="새로고침을 반복해도 캐시 ID가 유지되고, revalidateTag 이후 새로고침에서만 캐시 ID가 바뀐다."
      />
    </DemoContainer>
  )
}
