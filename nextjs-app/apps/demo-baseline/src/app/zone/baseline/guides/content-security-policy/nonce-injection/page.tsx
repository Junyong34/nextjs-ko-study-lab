import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CspNonceDemo } from './components/CspNonceDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"CSP 헤더 및 암호학적 Nonce 주입을 통한 XSS 방어"}
        concept={"미들웨어에서 매 요청마다 암호학적으로 안전한 128비트 nonce 값을 생성하여 CSP 응답 헤더와 <script nonce=\"...\"> 속성에 동시 주입함으로써 비인가 인라인 스크립트 실행(XSS)을 원천 차단합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택",
            description: "CSP 보안 정책이 적용된 쇼핑몰 환경에서 품목을 선택합니다.",
            actionBadge: "품목 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 버튼 조작",
            description: "인라인 스크립트 삽입 공격 방어 상태에서 정상 인터랙션을 수행합니다.",
            actionBadge: "수량 조절",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 Nonce 기반 보안 요청 전송",
            description: "올바른 Nonce가 부여된 합법적 스크립트만 브라우저에서 실행되는 동작을 확인합니다.",
            actionBadge: "보안 요청",
          },
          {
            step: 4,
            title: "CSP Nonce 헤더 검증 및 악성 스크립트 차단 상태 관찰",
            description: "인라인 스크립트에 일치하는 nonce 속성이 주입되어 콘솔 에러 없이 정상 실행되는지 검증합니다.",
            actionBadge: "CSP 검증",
            observe: "CSP Content-Security-Policy 응답 헤더 내 Nonce 값 일치 및 안전한 스크립트 실행 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Middleware Nonce 기반 CSP 헤더 주입 실습"}>
        <CspNonceDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
