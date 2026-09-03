import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'edge/v8-lightweight/nodejs-modules-bailout')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { EdgeNodejsBailoutDemo } from './components/EdgeNodejsBailoutDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="Edge Runtime 내 Node.js 전용 모듈 접근 차단 제한점"
        concept="Edge Runtime(export const runtime = 'edge')에서는 경량 V8 Isolate 보안 제약으로 인해 fs, net, child_process 같은 Node.js 내장 모듈 접근이 100% 차단(Bailout)됩니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "Edge 런타임 환경에서 실행될 상품 컴포넌트를 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "Edge 환경에서 Node.js 전용 모듈(fs 등) 호출 시 발생하는 번들링 에러 및 Bailout 동작을 확인합니다.",
            actionBadge: "Bailout 실행",
          },
          {
            step: 3,
            title: "Node.js 모듈 접근 차단 로그 및 Edge 대안 확인",
            description: "파일시스템 직접 접근 대신 HTTP 기반 드라이버(Web Fetch)를 사용하는 아키텍처 전환 로그를 확인합니다.",
            actionBadge: "로그 검증",
            observe: "Edge Runtime에서 Node.js 전용 모듈 호출이 차단(Bailout)되고 대안 API가 안내됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Edge Runtime 내 Node.js 전용 모듈 접근 차단 제한점 실습"}>
        <EdgeNodejsBailoutDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
