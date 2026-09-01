import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PartialPrefetchDemo } from './components/PartialPrefetchDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"호버 시점 정적 셸 표시"}
        concept={"이 예제는 링크에 마우스를 올렸을 때 정적 셸의 표시 상태가 바뀌는 흐름을 보여줍니다. 실제 Partial Prefetching 네트워크 요청은 production 환경의 Network 탭에서 확인해야 합니다."}
        steps={[
          {
            step: 1,
            title: "[상품 링크]에 마우스를 올려 정적 셸 표시",
            description: "링크에 마우스를 올리면 정적 레이아웃 셸이 표시됩니다.",
            actionBadge: "호버 상태",
          },
          {
            step: 2,
            title: "정적 셸 표시 상태 확인",
            description: "호버 전후의 정적 셸 표시 상태를 비교합니다.",
            actionBadge: "상태 확인",
          },
          {
            step: 3,
            title: "링크 클릭 뒤 실제 네트워크 동작 확인",
            description: "production 환경의 Network 탭에서 prefetch 요청과 동적 데이터 요청을 확인합니다.",
            actionBadge: "Network 확인",
            observe: "호버 상태가 바뀌고, 실제 prefetch 요청 여부는 production Network 탭에서 확인함",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"링크 호버 시 정적 셸 표시 실습"}>
        <PartialPrefetchDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
