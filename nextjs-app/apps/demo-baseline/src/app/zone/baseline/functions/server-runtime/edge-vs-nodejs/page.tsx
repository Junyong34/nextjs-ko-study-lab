'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RuntimeProbePlayground } from './components/RuntimeProbePlayground'
import { VerificationFooter } from './components/VerificationFooter'
import type { RuntimeCheckState } from './types'

export default function DemoPage() {
  const [checkState, setCheckState] = useState<RuntimeCheckState>({ edge: null, nodejs: null })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Server Component runtime 분기 제어"
        concept="export const runtime = 'edge' | 'nodejs'는 route segment가 실행될 JavaScript 런타임을 고른다. 같은 화면에서 두 라우트(api/edge, api/nodejs)를 각각 호출해 실제 실행 환경(process.env.NEXT_RUNTIME)과 Node.js 전용 API 호출 성공/실패가 정말로 갈리는지 실측한다."
        steps={[
          {
            step: 1,
            title: "[Edge 라우트 호출] 클릭",
            description: "runtime = 'edge'로 선언된 api/edge/route.ts에 실제 HTTP 요청을 보냅니다.",
            actionBadge: 'edge 호출',
            observe: 'NEXT_RUNTIME=edge로 실행되고, node:fs / node:crypto 호출이 둘 다 실패함',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: "[Node.js 라우트 호출] 클릭",
            description: "runtime = 'nodejs'로 선언된 api/nodejs/route.ts에 실제 HTTP 요청을 보냅니다.",
            actionBadge: 'nodejs 호출',
            observe: 'NEXT_RUNTIME=nodejs로 실행되고, node:fs / node:crypto 호출이 둘 다 성공함',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널에서 두 런타임의 실행 결과 대조',
            description: '선언한 runtime과 실제 측정값(NEXT_RUNTIME, API 성공/실패)이 정확히 일치하는지 확인합니다.',
            actionBadge: '결과 검증',
            observe: '두 라우트 모두 선언한 runtime대로 실제 실행 환경이 분기됨',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="Route Handler runtime 분기 실습 (api/edge vs api/nodejs)">
        <RuntimeProbePlayground onResultChange={setCheckState} />
      </DemoPlaygroundCard>
      <VerificationFooter state={checkState} />
    </DemoContainer>
  )
}
