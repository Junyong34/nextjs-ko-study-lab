import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OptionalCatchAllDemo } from './components/OptionalCatchAllDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Optional Catch-all [[...slug]] 루트 인덱스 겸용"}
        concept={"대괄호를 두 번 감싸면 세그먼트가 없는 경로까지 같은 파일이 받습니다. [...slug]는 /docs에서 404가 되지만 [[...slug]]는 slug가 undefined인 상태로 /docs 인덱스를 렌더링합니다."}
        steps={[
          {
            step: 1,
            title: "[해당 문서로 이동 →] 클릭",
            description: "optional catch-all 라우트로 진입합니다.",
            actionBadge: "[[...slug]]",
          },
          {
            step: 2,
            title: "[/docs (루트 인덱스)] 이동",
            description: "slug 없이 진입해도 404가 아니라 인덱스 화면이 뜹니다. 이것이 선택적 catch-all의 핵심 차이입니다.",
            actionBadge: "slug 없음",
          },
          {
            step: 3,
            title: "[/docs/routing/dynamic-routes (2단계)] 이동",
            description: "같은 파일이 2단계 경로도 그대로 처리합니다.",
            actionBadge: "깊이 2",
            observe: "slug가 undefined일 때와 배열일 때 모두 같은 page.tsx가 응답하는지, /docs에서 404가 뜨지 않는지 확인",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"[[...slug]] Optional Catch-all 동적 세그먼트 실습"}>
        <OptionalCatchAllDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
