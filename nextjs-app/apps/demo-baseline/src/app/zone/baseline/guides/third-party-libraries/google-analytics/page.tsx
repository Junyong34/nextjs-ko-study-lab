import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/third-party-libraries/google-analytics')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ThirdPartyGaDemo } from './components/ThirdPartyGaDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"@next/third-parties Google Analytics(GA4) 최적화 통합"}
        concept={"@next/third-parties/google의 <GoogleAnalytics gaId=\"G-...\" /> 컴포넌트를 사용하여 web worker 또는 afterInteractive 방식으로 GA4 스크립트를 로드하고 페이지뷰를 0ms 지연 없이 추적합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택",
            description: "GA4 전자상거래 이벤트가 바인딩된 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "장바구니 담기 액션을 실행하여 gtag send_event 이벤트를 트리거합니다.",
            actionBadge: "이벤트 트리거",
          },
          {
            step: 3,
            title: "GA4 측정 ID(G-XXXXXXXX) 및 이벤트 페이로드 전송 관찰",
            description: "메인 스레드 차단 없이 백그라운드에서 구글 애널리틱스로 이벤트가 전송되는지 검증합니다.",
            actionBadge: "추적 검증",
            observe: "GoogleAnalytics 컴포넌트를 통한 GA4 스크립트 비차단 로딩 및 상품 이벤트 트리거 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"@next/third-parties Google Analytics 최적화 실습"}>
        <ThirdPartyGaDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
