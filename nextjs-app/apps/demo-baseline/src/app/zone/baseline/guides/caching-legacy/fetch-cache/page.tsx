import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/caching-legacy/fetch-cache')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { FetchCacheLab } from './components/FetchCacheLab'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="레거시 fetch 캐시 옵션 비교 (force-cache / no-store / revalidate)"
        concept="같은 원본을 fetch 옵션만 바꿔 호출하고, 원본이 실제로 실행되는지(sourceCount 증가)로 Data Cache 적중 여부를 확인합니다. cacheComponents가 꺼진 zone이라 이전 캐싱 모델이 적용됩니다."
        steps={[
          {
            step: 1,
            title: "[기록 초기화] 후 [force-cache 요청]을 3번 누르기",
            description: "기존 캐시를 지운 뒤 첫 호출은 원본을 실행하고, 이후는 Data Cache 응답을 받습니다.",
            actionBadge: "캐시 적중",
            observe: "sourceCount가 첫 값에서 그대로, 소요 시간이 짧아지는지",
            observeAt: "playground",
          },
          {
            step: 2,
            title: "[no-store 요청]을 3번 누르기",
            description: "매 호출이 원본을 실행하므로 sourceCount가 계속 오릅니다. [옵션 없음 요청]도 같은 결과입니다.",
            actionBadge: "캐시 우회",
            observe: "sourceCount가 호출마다 증가하는지",
            observeAt: "playground",
          },
          {
            step: 3,
            title: "[revalidate 10초 요청] 후 [revalidateTag로 캐시 무효화]",
            description: "10초 안에는 고정된 값이 유지됩니다. 무효화 뒤 [force-cache 요청]을 다시 누르면 원본이 새로 실행됩니다.",
            actionBadge: "시간·태그 갱신",
            observe: "무효화 전후로 force-cache의 sourceCount가 바뀌는지, 검증 패널의 모드별 판정",
            observeAt: "verification",
          },
        ]}
      />
      <FetchCacheLab />
    </DemoContainer>
  )
}
