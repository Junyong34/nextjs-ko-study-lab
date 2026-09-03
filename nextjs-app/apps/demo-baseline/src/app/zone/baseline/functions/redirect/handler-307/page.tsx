import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/redirect/handler-307')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RedirectHandler307Demo } from './components/RedirectHandler307Demo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="Route Handler 내 redirect() (307 Temporary Redirect)"
        concept="Route Handler(GET/POST) 내부에서 redirect(url, RedirectType.replace)를 호출하여 HTTP 메서드를 보존하는 임시 리다이렉트(307 Temporary)를 수행합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "Route Handler 호출 대상 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "API Route에서 redirect()를 호출하여 임시 엔드포인트로 이동시킵니다.",
            actionBadge: "핸들러 실행",
          },
          {
            step: 3,
            title: "HTTP 307 임시 리다이렉트 상태 관찰",
            description: "HTTP 메서드와 페이로드가 보존된 상태로 대상 URL로 분기되는지 확인합니다.",
            actionBadge: "307 검증",
            observe: "Route Handler 내부 redirect() 호출로 HTTP 307 Temporary Redirect가 정상 수행됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Route Handler 내 redirect() (307 Temporary Redirect) 실습"}>
        <RedirectHandler307Demo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
