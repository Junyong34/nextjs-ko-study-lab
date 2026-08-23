import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CatchAllSlugDemo } from './components/CatchAllSlugDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Catch-all 세그먼트 [...slug] 다단계 카테고리"}
        concept={"shop/[...slug]/page.tsx의 slug는 배열입니다. /shop/fashion은 길이 1, /shop/fashion/shoes/running은 길이 3으로 들어오며, 몇 단계든 한 파일이 모두 받아 브레드크럼을 조립합니다."}
        steps={[
          {
            step: 1,
            title: "[해당 카테고리 진입 →] 클릭",
            description: "catch-all 라우트로 진입합니다.",
            actionBadge: "[...slug]",
          },
          {
            step: 2,
            title: "[/shop/fashion (1단계)] 이동",
            description: "slug 배열에 요소가 1개 담깁니다.",
            actionBadge: "깊이 1",
          },
          {
            step: 3,
            title: "[/shop/fashion/shoes/running (3단계)] 이동",
            description: "같은 파일에 slug 배열 요소가 3개로 늘어난 채 전달됩니다.",
            actionBadge: "깊이 3",
            observe: "경로 깊이가 바뀔 때 slug 배열 길이와 브레드크럼 단계 수가 함께 늘어나는지, 라우트 파일은 계속 하나인지 확인",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"[...slug] Catch-all 동적 세그먼트 실습"}>
        <CatchAllSlugDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
