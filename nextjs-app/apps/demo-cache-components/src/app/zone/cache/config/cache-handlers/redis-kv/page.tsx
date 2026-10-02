import React from 'react'
import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ConfigCacheHandlersDemo } from './components/ConfigCacheHandlersDemo'
import { VerificationFooter } from './components/VerificationFooter'

export const metadata: Metadata = getDemoMetadata('cache', 'config/cache-handlers/redis-kv')

// 페이지 자체는 정적 셸이다. 기본 핸들러 실측은 브라우저가 probe Route Handler를 호출해 수행한다.
export default function DemoPage() {
  return (
    <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
      <DemoGuideCard
        title="cacheHandlers: 'use cache' 저장소를 바꾸는 설정"
        concept="cacheHandlers는 'use cache'와 'use cache: remote'가 엔트리를 저장할 핸들러를 지정합니다. 설정하지 않으면 프로세스마다 메모리 LRU에 따로 저장됩니다. 이 앱은 설정하지 않은 상태를 실측하고, Redis 연동은 예제와 절차로 설명합니다."
        className="min-w-0 break-words"
        steps={[
          {
            step: 1,
            title: '[캐시 읽기]를 두 번 누르기',
            description: "probe가 'use cache' 함수를 호출합니다. 두 번째 읽기가 같은 cacheId와 같은 계산 시각을 받는지 봅니다.",
            observe: '회차별 cacheId, 계산 시각, 응답한 PID',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[캐시 무효화] 후 [캐시 읽기]를 두 번 더 누르기',
            description: "revalidateTag로 데모 태그를 즉시 만료시킵니다. 첫 읽기만 새 cacheId를 받고 이후에는 다시 재사용되는지 확인합니다.",
            observe: '기본 핸들러 실측 패널의 판정과 PID',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '설정 예제를 읽고 [개념 확인]에 답하기',
            description: '이 앱에 적용하지 않은 cacheHandlers 예제와 별도 앱 확인 절차를 읽고 답을 고릅니다. [답안 초기화]로 다시 풀 수 있습니다.',
            observe: '정답 수와 문항별 해설',
            observeAt: 'verification',
          },
        ]}
      />
      <ConfigCacheHandlersDemo />
      <VerificationFooter />
    </DemoContainer>
  )
}
