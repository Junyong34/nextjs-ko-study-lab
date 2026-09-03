import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/redirects/regex-pattern-matching')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigRedirectsRegexDemo } from './components/ConfigRedirectsRegexDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="redirects() 정규식 패턴 및 와일드카드 리다이렉트"
        concept="next.config.ts의 redirects() 설정을 통해 구형 카탈로그 경로(/old-catalog/:year(\d{4})/:id)를 정규식 매칭하여 신규 표준 상품 URL로 HTTP 308 영구 리다이렉트합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "정규식 리다이렉트 규칙 대상 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "next.config.ts에 정의된 와일드카드/정규식 리다이렉트 규칙 매칭을 트리거합니다.",
            actionBadge: "규칙 매칭",
          },
          {
            step: 3,
            title: "정규식 파라미터 치환 및 308 리다이렉트 로그 관찰",
            description: "정규식 캡처 그룹이 신규 URL 파라미터로 정상 치환되어 HTTP 308로 분기되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "next.config.ts 정규식 규칙에 따라 신규 경로로 HTTP 308 리다이렉트가 정상 처리됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"redirects() 정규식 패턴 및 와일드카드 리다이렉트 실습"}>
        <ConfigRedirectsRegexDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
