import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/proxy/gateway-router')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProxyGatewayDemo } from './components/ProxyGatewayDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"proxy.ts API 게이트웨이 라우팅 및 헤더 조작"}
        concept={"외부 레거시 백엔드나 MSA 마이크로서비스로 요청을 포워딩하기 전 proxy.ts에서 인증 토큰 헤더(headers)를 주입하고 라우팅을 재작성하여 200 OK 응답을 반환합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "프록시 게이트웨이를 통과할 대상 요청 데이터를 선택합니다.",
        "actionBadge": "요청 선택"
        },
        {
        "step": 2,
        "title": "[+] 수량 조절 후 [동작 실행] 클릭",
        "description": "proxy.ts 라우터로 요청을 전송하여 헤더 변환 및 프록시 처리를 실행합니다.",
        "actionBadge": "프록시 실행"
        },
        {
        "step": 3,
        "title": "게이트웨이 헤더 주입 및 포워딩 확인",
        "description": "x-forwarded-host 및 인증 헤더가 주입되어 타깃 API로 정상 프록시되는지 확인합니다.",
        "actionBadge": "헤더 확인",
        "observe": "3단 검증 패널에서 proxy.ts를 거친 요청 헤더 및 라우팅 상태 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"내부 마이크로서비스 프록시 라우팅 (proxy.ts) 실습"}>
        <ProxyGatewayDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
