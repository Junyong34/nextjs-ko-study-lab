import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-segment-config/runtime-nodejs-edge')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RuntimeNodejsEdgeDemo } from './components/RuntimeNodejsEdgeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="export const runtime = 'nodejs' | 'edge' 런타임 분기"
        concept="라우트 세그먼트 실행 엔진을 글로벌 CDN 엣지(Edge 0ms 콜드스타트) 또는 네이티브 모듈 지원 Node.js 풀스택 환경으로 선택 분기합니다."
        steps={[
          {
            step: 1,
            title: "[Edge 런타임 (V8 Isolate)] 버튼 선택 및 특성 점검",
            description: "V8 Isolate 기반으로 전 세계 300개 이상 CDN 엣지에서 0ms 콜드스타트로 실행되는 사양을 확인합니다.",
            actionBadge: "Edge 0ms",
          },
          {
            step: 2,
            title: "[Node.js 런타임 (풀스택)] 버튼 선택 및 특성 점검",
            description: "fs, crypto, pg 등 모든 Node.js 네이티브 C++ 모듈과 풀스택 라이브러리를 활용하는 사양을 확인합니다.",
            actionBadge: "Node.js 풀스택",
          },
          {
            step: 3,
            title: "워크로드별 런타임 최적화 분기 및 사양 대조 관찰",
            description: "경량 인증/프록시는 Edge로, 무거운 DB 작업은 Node.js로 배포하는 최적 아키텍처를 검증합니다.",
            actionBadge: "분기 검증",
            observe: "런타임 전환에 따라 0ms 콜드스타트 경량 엣지와 네이티브 모듈 풀스택 환경의 특성 차이가 정확히 대조됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="nodejs vs edge 런타임 대조 실습">
        <RuntimeNodejsEdgeDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
