import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/server-runtime/edge-vs-nodejs')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ServerRuntimeEdgeNodeDemo } from './components/ServerRuntimeEdgeNodeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Server Component runtime 분기 제어"
        concept="export const runtime = 'nodejs' vs 'edge' 설정을 통해 서버 컴포넌트의 실행 엔진을 0ms 콜드스타트의 V8 Edge Isolate와 Node.js 런타임으로 명시 분기합니다."
        steps={[
          {
            step: 1,
            title: "[Edge API 테스트] 버튼 선택 후 Web 표준 API 호환성 점검",
            description: "crypto.subtle, Streams 등 Edge 런타임에서 사용 가능한 Web 표준 API 목록을 확인합니다.",
            actionBadge: "Edge 점검",
          },
          {
            step: 2,
            title: "[Node.js API 테스트] 버튼 선택 후 네이티브 모듈 지원 점검",
            description: "node:fs, Buffer 등 풀스택 Node.js 환경에서만 구동되는 API 호환성을 확인합니다.",
            actionBadge: "Node 점검",
          },
          {
            step: 3,
            title: "런타임 분기별 성능 및 API 지원 격리 관찰",
            description: "런타임 선언에 따른 콜드스타트 속도와 사용 가능한 API 스펙 차이가 올바르게 분기되는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "선언된 runtime 세그먼트 설정에 맞춰 실행 엔진(Node.js vs Edge)의 API 지원 여부가 정확히 분기됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="Server Component runtime 분기 제어 실습">
        <ServerRuntimeEdgeNodeDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
