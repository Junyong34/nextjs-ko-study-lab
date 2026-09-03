import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/caching-legacy/segment-revalidate')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SegmentRevalidateDemo } from './components/SegmentRevalidateDemo'
import { VerificationFooter } from './components/VerificationFooter'

export const revalidate = 10

export default function DemoPage() {
  const renderId = Math.random().toString(36).slice(2, 8).toUpperCase()
  const generatedAt = new Date().toLocaleTimeString()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"라우트 세그먼트 레벨 revalidate 설정"}
        concept={"페이지 세그먼트 상단에 export const revalidate = 10을 선언하면 이 라우트의 렌더 결과가 10초간 캐시되고, 그 이후 요청에서만 백그라운드로 재계산됩니다."}
        steps={[
          {
            step: 1,
            title: "현재 renderId, generatedAt 확인",
            description: "이 페이지가 마지막으로 재계산된 시점의 식별자를 확인합니다.",
            actionBadge: "초기 상태 확인",
          },
          {
            step: 2,
            title: "10초 이내에 새로고침",
            description: "revalidate 기간 안에는 renderId가 그대로 유지되는지 확인합니다.",
            actionBadge: "캐시 유지 확인",
          },
          {
            step: 3,
            title: "10초 이후 새로고침",
            description: "revalidate 기간이 지난 뒤에는 renderId가 바뀌는지 확인합니다.",
            actionBadge: "재계산 확인",
            observe: "10초 전후 renderId 값의 변화를 직접 대조 관찰",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Route Segment revalidate 설정 실습"}>
        <SegmentRevalidateDemo renderId={renderId} generatedAt={generatedAt} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(renderId)}
        actual={`- renderId: ${renderId}\n- generatedAt: ${generatedAt}\n- revalidate: 10초`}
        expected="10초 이내 재방문은 같은 renderId, 10초 이후 재방문은 새 renderId를 반환해야 한다."
      />
    </DemoContainer>
  )
}
