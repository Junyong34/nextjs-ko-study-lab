import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/remote-redis-cache')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DirectiveUseCacheRemoteDemo } from './components/DirectiveUseCacheRemoteDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getRemoteStockSnapshot } from './cachedData'
import type { PodInstance } from './types'

const PODS: PodInstance[] = [
  { id: 'card-seoul-1', name: '화면 A (Seoul-1 표기)', region: 'ap-northeast-2' },
  { id: 'card-seoul-2', name: '화면 B (Seoul-2 표기)', region: 'ap-northeast-2' },
  { id: 'card-tokyo-1', name: '화면 C (Tokyo-1 표기)', region: 'ap-northeast-1' },
]

export default async function DemoPage() {
  // 3개 화면이 각자 독립적으로 같은 'use cache: remote' 함수를 인자 없이 호출한다.
  // 캐시 HIT라면 셋 다 같은 cacheId를 받는다 — 이것이 "공유 캐시 풀"의 실측 증거다.
  const [seoul1, seoul2, tokyo1] = await Promise.all([
    getRemoteStockSnapshot(),
    getRemoteStockSnapshot(),
    getRemoteStockSnapshot(),
  ])
  const snapshots = [seoul1, seoul2, tokyo1]
  const allCacheIdsMatch = snapshots.every((s) => s.cacheId === snapshots[0].cacheId)
  const allStockMatch = snapshots.every((s) => s.stock === snapshots[0].stock)

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use cache: remote' 공유 원격 캐시 풀 연동"}
        concept={
          "Next.js 16 'use cache: remote'는 cacheHandlers.remote를 설정하지 않으면 'use cache'와는 별개의 기본 in-memory 캐시 풀을 씁니다. 이 데모는 3개 화면(카드)이 같은 cacheTag가 붙은 함수를 각자 호출해도 동일한 캐시 엔트리(cacheId)를 공유해서 읽는다는 것을 실측으로 보여줍니다."
        }
        steps={[
          {
            step: 1,
            title: '3개 화면의 cacheId·재고 초기 상태 확인',
            description: '카드마다 독립적으로 getRemoteStockSnapshot()을 호출했지만 cacheId가 모두 같은지 확인합니다.',
            actionBadge: '캐시 HIT 확인',
          },
          {
            step: 2,
            title: '[주문 구매 (재고 -1)] 클릭',
            description: 'Server Action이 실제 재고를 차감하고 revalidateTag(tag, \'max\')로 공유 캐시 엔트리를 stale로 표시합니다.',
            actionBadge: '재고 차감',
          },
          {
            step: 3,
            title: '새로고침 후 3개 화면이 새 값을 함께 반영하는지 관찰',
            description: '캐시가 갱신되면 3개 화면 모두 같은 새 cacheId·재고를 다시 공유해서 받습니다.',
            actionBadge: '공유 캐시 갱신',
            observe: '3개 카드의 cacheId·재고가 서로 일치하며, 이전 값과 달라졌는지 대조',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title={"'use cache: remote' 공유 캐시 풀 실습"}>
        <DirectiveUseCacheRemoteDemo pods={PODS} snapshots={snapshots} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={allCacheIdsMatch && allStockMatch}
        expected="3개 화면이 각자 getRemoteStockSnapshot()을 호출해도 같은 캐시 엔트리를 공유하므로 cacheId와 재고 값이 모두 동일해야 한다."
        actual={`- 화면 A cacheId #${seoul1.cacheId} · 재고 ${seoul1.stock}개\n- 화면 B cacheId #${seoul2.cacheId} · 재고 ${seoul2.stock}개\n- 화면 C cacheId #${tokyo1.cacheId} · 재고 ${tokyo1.stock}개`}
      />
    </DemoContainer>
  )
}
