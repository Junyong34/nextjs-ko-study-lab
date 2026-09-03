import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cache-life/preset-profiles')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheLifePresetsDemo } from './components/CacheLifePresetsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="cacheLife 내장 프리셋 프로필 (seconds, hours, max)"
        concept="cacheLife() 함수에 Next.js 16 빌트인 프리셋('seconds', 'hours', 'days')을 선언하여 캐시의 stale, revalidate, expire 수명 주기를 직관적으로 지정합니다."
        steps={[
          {
            step: 1,
            title: "[cacheLife('seconds')] 클릭",
            description: "초 단위(stale: 1s, revalidate: 10s, expire: 60s) 초단기 캐시 수명 프로파일을 적용합니다.",
            actionBadge: "seconds 선택",
          },
          {
            step: 2,
            title: "[cacheLife('hours')] 또는 [cacheLife('days')] 클릭",
            description: "시간 단위 또는 일 단위의 중장기 캐시 수명 프로파일로 전환합니다.",
            actionBadge: "hours/days 선택",
          },
          {
            step: 3,
            title: "선택된 프리셋별 수명 주기 타임라인 관찰",
            description: "프리셋에 정의된 stale, revalidate, expire 초 단위 수치가 화면에 올바르게 반영되는지 확인합니다.",
            actionBadge: "수명 검증",
            observe: "선택한 cacheLife 프리셋에 따른 stale/revalidate/expire 수명 타임라인이 화면에 표시됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"cacheLife 내장 프리셋 프로필 (seconds, hours, max) 실습"}>
        <CacheLifePresetsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
