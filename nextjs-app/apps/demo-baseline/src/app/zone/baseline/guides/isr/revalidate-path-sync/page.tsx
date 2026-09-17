import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/isr/revalidate-path-sync')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidatePathSyncDemo } from './components/RevalidatePathSyncDemo'

export const revalidate = 3600

export default function DemoPage() {
  const renderId = Math.random().toString(36).slice(2, 8).toUpperCase()
  const generatedAt = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"revalidatePath로 이 페이지 세그먼트 캐시 즉시 무효화"}
        concept={"이 페이지는 export const revalidate = 3600으로 1시간 캐시됩니다. Server Action에서 revalidatePath(이 페이지의 실제 경로)를 호출하면 1시간을 기다리지 않고도 이 화면을 보고 있는 상태에서 즉시 새 renderId로 재계산됩니다."}
        steps={[
          {
            step: 1,
            title: "현재 renderId, generatedAt 확인",
            description: "이 페이지 세그먼트가 마지막으로 렌더링된 시점의 식별자와 시각을 확인합니다.",
            actionBadge: "초기 상태 확인",
          },
          {
            step: 2,
            title: "[revalidatePath 실행] 버튼 클릭",
            description: "Server Action에서 이 페이지의 실제 라우트 경로로 revalidatePath를 호출합니다.",
            actionBadge: "경로 무효화 실행",
          },
          {
            step: 3,
            title: "renderId·generatedAt 갱신 관찰",
            description: "버튼 클릭 후 같은 화면에서 renderId와 generatedAt이 새 값으로 바뀌는지 확인합니다.",
            actionBadge: "즉시 반영 검증",
            observe: "revalidatePath 호출 후 이 화면을 보고 있는 상태에서 renderId·generatedAt이 곧바로 새 값으로 바뀌는 결과 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"revalidatePath에 따른 라우트 범위별 무효화 실습"}>
        <RevalidatePathSyncDemo renderId={renderId} generatedAt={generatedAt} />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
