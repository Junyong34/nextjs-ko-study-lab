import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/draft-mode/enable-preview')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DraftModeEnableDemo } from './components/DraftModeEnableDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="draftMode().enable() 초안 모드 활성화"
        concept="draftMode().enable()을 실행하여 __prerender_bypass 쿠키를 브라우저에 발급하고 0ms 지연으로 정적 캐시를 우회하여 CMS 초안 상품을 즉시 미리보기 렌더링합니다."
        steps={[
          {
            step: 1,
            title: "[draftMode().enable() 실행] 클릭",
            description: "Route Handler에서 draftMode().enable()을 호출하여 미리보기 바이패스 쿠키를 발급합니다.",
            actionBadge: "미리보기 활성화",
          },
          {
            step: 2,
            title: "__prerender_bypass 쿠키 발급 및 정적 캐시 우회 확인",
            description: "브라우저 쿠키에 초안 모드 토큰이 저장되고 정적 페이지 캐시가 실시간 바이패스 모드로 전환됩니다.",
            actionBadge: "바이패스 확인",
          },
          {
            step: 3,
            title: "미발행 초안(Draft) 상품 렌더링 관찰",
            description: "화면에 초안 모드 뱃지와 함께 CMS 비공개 상품 데이터가 렌더링되는지 확인합니다.",
            actionBadge: "초안 렌더링",
            observe: "draftMode 활성화 후 정적 캐시가 우회되어 비공개 초안 상품 데이터가 즉시 렌더링됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"draftMode().enable() 초안 모드 활성화 실습"}>
        <DraftModeEnableDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
