import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/taint-unique-value/block-secret')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TaintUniqueValueDemo } from './components/TaintUniqueValueDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="experimental_taintUniqueValue 원시 시크릿 유출 차단"
        concept="React 19 experimental_taintUniqueValue API를 사용하여 결제 API Secret Key나 암호 토큰 문자열이 Client Component props로 직렬화 유출되는 것을 런타임 차단합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "보안 시크릿이 바인딩된 결제 컨텍스트 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "taintUniqueValue로 오염(Taint) 표기된 원시 시크릿을 클라이언트로 전달하려는 동작을 시뮬레이션합니다.",
            actionBadge: "시크릿 전달 시도",
          },
          {
            step: 3,
            title: "React Taint 런타임 에러 차단 및 보안 로그 관찰",
            description: "클라이언트 번들로의 시크릿 유출이 원천 차단되고 보안 방어 로그가 기록되는지 확인합니다.",
            actionBadge: "차단 검증",
            observe: "experimental_taintUniqueValue에 의해 민감 시크릿 키의 클라이언트 직렬화가 원천 차단됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"experimental_taintUniqueValue 원시 시크릿 유출 차단 실습"}>
        <TaintUniqueValueDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
