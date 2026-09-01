import React from 'react'
import { headers } from 'next/headers'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { NonceInjectionSection } from './components/NonceInjectionSection'

export default async function DemoPage() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"CSP 헤더 및 암호학적 Nonce 주입을 통한 XSS 방어"}
        concept={"proxy.ts가 매 요청마다 nonce 값을 생성해 CSP 응답 헤더와 <script nonce=\"...\"> 속성에 주입합니다. Next.js 프레임워크 스크립트에도 이 nonce를 적용할 수 있으며, nonce가 없는 인라인 스크립트는 브라우저가 CSP에 따라 실행하지 않습니다."}
        steps={[
          {
            step: 1,
            title: "발급된 nonce 값 확인",
            description: "proxy.ts가 이번 요청에 대해 발급한 nonce 값을 실습 패널에서 확인합니다.",
            actionBadge: "nonce 확인",
          },
          {
            step: 2,
            title: "nonce 일치 스크립트 실행 여부 관찰",
            description: "nonce 속성이 붙은 인라인 스크립트가 실제로 실행되어 true로 표시되는지 확인합니다.",
            actionBadge: "실행 확인",
          },
          {
            step: 3,
            title: "nonce 없는 스크립트 차단 여부 관찰",
            description: "nonce 속성이 없는 동일한 형태의 인라인 스크립트가 CSP에 의해 차단되어 false로 남는지 확인합니다.",
            actionBadge: "차단 확인",
            observe: "CSP가 nonce 유무에 따라 스크립트 실행을 실제로 허용/차단하는 것을 검증 패널에서 관찰",
            observeAt: "verification",
          },
        ]}
      />
      <NonceInjectionSection nonce={nonce} />
    </DemoContainer>
  )
}
