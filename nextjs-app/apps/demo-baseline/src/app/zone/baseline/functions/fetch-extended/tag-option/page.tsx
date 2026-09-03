import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/fetch-extended/tag-option')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FetchExtendedTagDemo } from './components/FetchExtendedTagDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="Next.js 확장 fetch tags 태그 바인딩"
        concept="확장 fetch의 { next: { tags: ['products', 'catalog'] } } 옵션을 통해 개별 HTTP 응답에 태그를 부여하고 주문/재고 변경 시 주문형 무효화를 지원합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "태그가 부여된 상품 fetch 대상을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "next.tags: ['products']가 바인딩된 확장 fetch 요청을 실행합니다.",
            actionBadge: "태그 바인딩",
          },
          {
            step: 3,
            title: "태그 바인딩 및 캐시 엔트리 연관 상태 관찰",
            description: "부여된 캐시 태그와 상품 주문 정보가 실시간 도메인 로그에 정상 기록되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "fetch 요청에 바인딩된 캐시 태그 정보가 실시간 도메인 로그에 정상 등록됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Next.js 확장 fetch tags 태그 바인딩 실습"}>
        <FetchExtendedTagDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
