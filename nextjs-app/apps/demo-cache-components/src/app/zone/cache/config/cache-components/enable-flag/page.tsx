import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'config/cache-components/enable-flag')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { EnableFlagWorkbench } from './components/EnableFlagWorkbench'
import { EnableFlagDeepDive } from './components/EnableFlagDeepDive'

/**
 * Next가 next.config의 cacheComponents 값을 서버 번들에 주입한 내부 상수 (관찰용, 공개 API 아님).
 * 클라이언트 번들 값은 EnableFlagWorkbench에서 따로 읽어 둘을 비교한다.
 */
const serverFlag: unknown = process.env.__NEXT_CACHE_COMPONENTS

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="cacheComponents: true Next.js 16 플래그 활성화"
        concept="next.config.ts 최상위의 cacheComponents: true는 'use cache' 지시어를 쓸 수 있게 하고, Partial Prerendering(정적 셸 + 스트리밍)을 기본 동작으로 만들며, 내비게이션 시 이전 라우트를 React <Activity>로 숨겨 state를 보존합니다. 이 zone은 플래그가 항상 켜져 있으므로 그 결과를 실제 응답과 DOM으로 측정합니다."
        steps={[
          {
            step: 1,
            title: '[probe 측정]을 2회 누르기',
            description:
              "probe 라우트의 HTML을 직접 읽어, 정적 마크업·'use cache' 결과·Suspense fallback이 먼저 오고 connection() 뒤 데이터가 나중에 스트리밍되는지, 'use cache' ID가 재사용되는지 기록합니다.",
            actionBadge: '응답 스트림 측정',
          },
          {
            step: 2,
            title: '[blocking 측정] 누르기',
            description:
              '같은 데이터를 Suspense 없이 읽는 라우트입니다. 플래그가 켜진 상태에서는 instant = false로 셸을 포기해야만 허용되고, 데이터가 끝날 때까지 헤더가 오지 않습니다.',
            actionBadge: '대조 측정',
          },
          {
            step: 3,
            title: '메모 입력 → [다른 라우트로 이동] → [실습 화면으로 돌아가기]',
            description:
              'away 페이지가 문서에 남은 이전 라우트 DOM을 조사하고, 돌아온 뒤 입력값과 인스턴스 ID가 그대로인지 확인합니다.',
            actionBadge: 'Activity 관측',
            observe: '검증 결과 5개 항목이 모두 [일치]로 바뀐다',
            observeAt: 'verification',
          },
        ]}
      />
      <EnableFlagWorkbench serverFlag={serverFlag} />
      <EnableFlagDeepDive />
    </DemoContainer>
  )
}
