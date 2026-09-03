import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/revalidate-tag/max-expiration')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidateTagMaxDemo } from './components/RevalidateTagMaxDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="revalidateTag max 캐시 만료 제어"
        concept="장기 보존(max TTL)으로 설정한 캐시 항목도 Server Action에서 revalidateTag()를 호출해 stale 상태로 표시할 수 있습니다. 새 캐시 값은 다음 요청에서 준비됩니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "장기 캐시(max)가 적용된 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "Server Action에서 revalidateTag를 호출하여 max 캐시 엔트리를 stale 상태로 표시합니다.",
            actionBadge: "만료 실행",
          },
          {
            step: 3,
            title: "stale 표시 및 캐시 갱신 로그 관찰",
            description: "max TTL 캐시가 stale 상태로 표시되고 이후 요청에서 새 주문 및 재고 상태가 준비되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "max 수명의 캐시 엔트리가 revalidateTag 호출로 stale 상태가 되고 이후 요청에서 갱신됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"revalidateTag max 캐시 만료 제어 실습"}>
        <RevalidateTagMaxDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
