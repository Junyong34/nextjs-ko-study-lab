import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instant-navigation/router-cache-back')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RouterCacheBackDemo } from './components/RouterCacheBackDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Client-side Router Cache를 통한 0ms 뒤로가기(router.back)"}
        concept={"Next.js 인메모리 Router Cache에 이전 방문한 세그먼트의 RSC 페이로드가 보관되어, router.back() 실행 시 서버 재요청 없이 화면이 복원됩니다. 실제 소요 시간은 performance.now()로 측정합니다."}
        steps={[
          {
            step: 1,
            title: "/catalog → /product → /checkout 실제 이동",
            description: "실제 Link로 세 단계를 순서대로 이동합니다.",
            actionBadge: "실제 이동",
          },
          {
            step: 2,
            title: "[← router.back()] 버튼 클릭",
            description: "Router Cache를 활용해 이전 페이지로 실제 뒤로가기를 실행합니다.",
            actionBadge: "뒤로가기 실행",
          },
          {
            step: 3,
            title: "실측 소요 시간(performance.now() 기준) 확인",
            description: "고정된 0ms 주장이 아니라 실제 측정된 밀리초 값을 확인합니다.",
            actionBadge: "실측 확인",
            observe: "router.back() 클릭부터 도착 페이지 마운트까지 실제 측정된 ms 값 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Router Cache를 통한 뒤로가기 실증 실습"}>
        <RouterCacheBackDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
