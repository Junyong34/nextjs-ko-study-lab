import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/update-tag/instant-memory-sync')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UpdateTagInstantDemo } from './components/UpdateTagInstantDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="장바구니 수량 상태 변경"
        concept="이 예제는 버튼 클릭에 따라 장바구니 수량이 바뀌는 클라이언트 상태를 보여줍니다. 실제 updateTag()를 호출하는 서버 캐시 동작과는 구분됩니다."
        steps={[
          {
            step: 1,
            title: "[수량 1개 늘리기] 클릭",
            description: "클라이언트 상태의 장바구니 수량을 1 늘립니다.",
            actionBadge: "수량 변경",
          },
          {
            step: 2,
            title: "수량 변경 결과 확인",
            description: "네트워크 요청 없이 화면의 수량이 바뀌는지 확인합니다.",
            actionBadge: "상태 변경",
          },
          {
            step: 3,
            title: "장바구니 수량 변경 관찰",
            description: "버튼을 누를 때마다 수량이 1씩 늘어나는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "버튼을 누르면 클라이언트 상태가 바뀌고 수량이 1 증가함",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"장바구니 수량 변경 실습"}>
        <UpdateTagInstantDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
