import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigHeadersSecurityDemo } from './components/ConfigHeadersSecurityDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="headers() 전역 보안 응답 헤더 일괄 주입 (CSP, HSTS)"
        concept="next.config.ts의 headers() 설정을 통해 모든 HTTP 응답에 Content-Security-Policy, Strict-Transport-Security, X-Frame-Options 등의 보안 헤더를 일괄 주입합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "보안 응답 헤더가 주입된 상품 페이지를 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "전역 보안 헤더 주입 설정이 적용된 응답 파이프라인을 호출합니다.",
            actionBadge: "헤더 호출",
          },
          {
            step: 3,
            title: "주입된 보안 헤더 (CSP, HSTS, XFO) 로그 관찰",
            description: "모든 응답에 XSS 및 클릭재킹 방어용 전역 보안 헤더가 올바르게 첨부되었는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "next.config.ts headers() 설정에 선언된 전역 보안 헤더가 응답에 일괄 주입됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"headers() 전역 보안 응답 헤더 일괄 주입 (CSP, HSTS) 실습"}>
        <ConfigHeadersSecurityDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
