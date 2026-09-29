import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/update-tag/instant-memory-sync')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { UpdateTagInstantDemo } from './components/UpdateTagInstantDemo'
import { getUpdateTagCartCache, getRevalidateTagCartCache } from './cachedData'

export default async function DemoPage() {
  const [updateTagCache, revalidateTagCache] = await Promise.all([
    getUpdateTagCartCache(),
    getRevalidateTagCartCache(),
  ])

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="updateTag() vs revalidateTag() — 장바구니 수량 즉시 반영 비교"
        concept="updateTag()는 Server Action 안에서 캐시를 즉시 만료시켜 다음 요청이 새 값을 기다리게 합니다(read-your-own-writes). revalidateTag(tag, 'max')는 캐시를 stale로만 표시해 다음 방문까지 이전 값이 먼저 보일 수 있습니다(stale-while-revalidate)."
        steps={[
          {
            step: 1,
            title: '두 패널의 초기 수량 확인',
            description: '왼쪽(updateTag)과 오른쪽(revalidateTag) 카드의 캐시된 조회 수량이 아직 같은 시작 값인지 확인합니다.',
            actionBadge: '초기 상태 확인',
          },
          {
            step: 2,
            title: '[updateTag 실행]과 [revalidateTag 실행]을 각각 클릭',
            description: '두 버튼은 실제 Server Action에서 updateTag() 또는 revalidateTag()를 호출해 각자의 장바구니 수량을 1 늘립니다.',
            actionBadge: '액션 실행',
          },
          {
            step: 3,
            title: '새로고침 직후 캐시 수량이 액션 응답을 따라잡는 시점 비교',
            description: 'updateTag 쪽은 새로고침 직후 캐시 수량이 액션 응답과 바로 같아집니다. revalidateTag 쪽은 같은 새로고침에서 이전 수량이 남아 있을 수 있습니다.',
            actionBadge: '즉시성 비교',
            observe: 'updateTag 캐시 수량은 즉시 액션 응답과 일치, revalidateTag 캐시 수량은 지연될 수 있음',
            observeAt: 'playground',
          },
        ]}
      />
      <UpdateTagInstantDemo updateTagCache={updateTagCache} revalidateTagCache={revalidateTagCache} />
    </DemoContainer>
  )
}
