import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cache-life/custom-profile')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheLifeCustomDemo } from './components/CacheLifeCustomDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getCustomProfileSnapshot, getBuiltinCompareSnapshot } from './cachedData'

// 커스텀 cacheLife 프로필의 정적 셸 프리렌더가 빌드 타임에 실패해(blocking-prerender-runtime)
// 정적 셸 없이 매 요청 시 렌더한다. 'use cache' 자체의 서버 캐싱 동작에는 영향이 없다.
export const instant = false

export default async function DemoPage() {
  const [custom, compare] = await Promise.all([
    getCustomProfileSnapshot(),
    getBuiltinCompareSnapshot(),
  ])

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next.config.ts에서 custom cacheLife 프로필 정의 및 바인딩"
        concept="cacheLife('minutes')처럼 내장 프리셋은 next.config.ts에 아무것도 적지 않아도 바로 쓸 수 있지만, 그 값이 우리 비즈니스에 맞지 않으면 next.config.ts의 cacheLife 객체에 원하는 이름으로 stale/revalidate/expire를 직접 정의하고 cacheLife('그 이름')으로 바인딩해야 합니다."
        steps={[
          {
            step: 1,
            title: 'custom-profile 카드와 minutes 카드의 초기 캐시 ID·생성 시각 확인',
            description:
              "왼쪽 카드는 next.config.ts에 새로 정의한 'functions-cache-life-custom-profile:restock-alert' 커스텀 프로필, 오른쪽 카드는 내장 'minutes' 프리셋에 바인딩된 실제 'use cache' 함수입니다.",
            actionBadge: '초기 상태 확인',
          },
          {
            step: 2,
            title: '[전체 새로고침]을 45초 이내 간격으로 2~3회 클릭',
            description:
              "custom-profile 카드는 revalidate가 45초라 그 전에는 캐시 ID가 유지되고, minutes 카드는 revalidate가 60초라 더 오래 유지됩니다. 두 값 모두 next.config.ts에 실제로 선언된 숫자입니다.",
            actionBadge: '재계산 주기 비교',
          },
          {
            step: 3,
            title: '두 카드의 stale/revalidate/expire 값과 next.config.ts 코드 대조',
            description:
              'custom-profile 카드의 숫자(20/45/240)는 어떤 내장 프리셋과도 겹치지 않는 이 데모 전용 값이고, minutes 카드의 숫자(300/60/3600)는 재정의 없이 그대로 쓴 내장 값입니다.',
            actionBadge: '결과 검증',
            observe: '두 카드의 stale/revalidate/expire 숫자가 next.config.ts / cacheLife.md 프리셋 표와 각각 일치한다',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title="next.config.ts에서 custom cacheLife 프로필 정의 및 바인딩 실습">
        <CacheLifeCustomDemo custom={custom} compare={compare} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(custom.cacheId && compare.cacheId)}
        actual={`- functions-cache-life-custom-profile:restock-alert #${custom.cacheId} (${custom.generatedAt}) → stale 20초 / revalidate 45초 / expire 240초\n- minutes(내장) #${compare.cacheId} (${compare.generatedAt}) → stale 300초 / revalidate 60초 / expire 3600초`}
        expected="custom-profile 카드는 next.config.ts에 새로 선언한 20/45/240초 값을, minutes 카드는 next.config.ts 수정 없이도 존재하는 내장 300/60/3600초 값을 그대로 반영한다."
      />
    </DemoContainer>
  )
}
