import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'guides/how-revalidation-works/swr-flow')

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { SwrFlowDemo } from './components/SwrFlowDemo'
import { getSwrFlowSnapshot } from './cachedData'

async function SwrFlowContent() {
  const snapshot = await getSwrFlowSnapshot()
  return <SwrFlowDemo cacheId={snapshot.cacheId} generatedAt={snapshot.generatedAt} />
}

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Cache Components SWR 백그라운드 revalidation 수명 주기"
        concept="cacheLife({ stale: 8, revalidate: 8, expire: 60 })로 캐시된 함수는 8초 동안 같은 캐시 ID를 그대로 반환합니다. 8초가 지난 뒤 첫 새로고침에는 그 캐시를 즉시 반환하면서 백그라운드로 새 값을 계산해 다음 새로고침부터 반영합니다."
        steps={[
          {
            step: 1,
            title: '캐시 생성 시각과 캐시 ID 확인',
            description: "'use cache'로 캐시된 함수가 반환한 캐시 ID와 생성 시각을 확인합니다.",
            actionBadge: '초기 상태 확인',
          },
          {
            step: 2,
            title: '8초 이내에 [새로고침 (SWR 테스트)] 클릭',
            description: '8초 이내에는 캐시 ID가 그대로 유지되는 FRESH 상태를 확인합니다.',
            actionBadge: 'FRESH 캐시 HIT',
          },
          {
            step: 3,
            title: '8초 경과 후 [새로고침 (SWR 테스트)] 클릭',
            description: '경과 후 첫 새로고침에서도 기존 캐시 ID가 그대로 보이며, 그 사이 백그라운드 재계산이 트리거됩니다.',
            actionBadge: 'STALE 백그라운드 갱신',
          },
          {
            step: 4,
            title: '한 번 더 새로고침해 갱신된 캐시 ID 관찰',
            description: '백그라운드 재계산이 끝난 뒤 새 캐시 ID와 생성 시각으로 교체되는 것을 확인합니다.',
            actionBadge: 'SWR 완료 관찰',
            observe: '8초 경과 후 두 번째 새로고침에서 캐시 ID와 생성 시각이 바뀌는 결과 관찰',
            observeAt: 'playground',
          },
        ]}
      />
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-zinc-400 font-mono animate-pulse">
            [대기] 캐시 데이터 로딩 중...
          </div>
        }
      >
        <SwrFlowContent />
      </Suspense>
    </DemoContainer>
  )
}
