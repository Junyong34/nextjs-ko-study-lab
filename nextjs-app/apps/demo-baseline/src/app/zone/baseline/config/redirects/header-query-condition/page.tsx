import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/redirects/header-query-condition')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigRedirectsHeaderDemo } from './components/ConfigRedirectsHeaderDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="redirects() 요청 헤더 및 쿼리 기반 조건부 리다이렉트"
        concept="next.config.ts redirects() 내 has: [{ type: 'header', key: 'x-beta-tester', value: 'true' }] 조건을 구성하여 특정 헤더/쿠키 보유자만 베타 결제 라우트로 자동 307 리다이렉트합니다."
        steps={[
          {
                    "step": 1,
                    "title": "next.config.ts has/missing 조건부 리다이렉트 규칙 점검 및 클라이언트 요청 헤더 일치 시 307 리다이렉트 실행",
                    "description": "헤더(x-beta-tester) 및 쿼리 조건에 따른 분기 명세를 확인합니다. 조건 헤더가 주입된 요청 수신 시 인프라 레벨에서 즉시 /beta-checkout으로 분기합니다.",
                    "actionBadge": "조건 규칙 점검"
          },
          {
                    "step": 2,
                    "title": "조건부 리다이렉트 및 분기 경로 관찰",
                    "description": "일치하지 않는 일반 요청은 통과하고, 베타 헤더를 가진 요청만 대상 경로로 이동하는지 확인합니다.",
                    "actionBadge": "결과 검증",
                    "observe": "has 조건(x-beta-tester) 일치 시 /beta-checkout으로 HTTP 307 자동 리다이렉트됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"redirects() 요청 헤더 및 쿼리 기반 조건부 리다이렉트 실습"}>
        <ConfigRedirectsHeaderDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
