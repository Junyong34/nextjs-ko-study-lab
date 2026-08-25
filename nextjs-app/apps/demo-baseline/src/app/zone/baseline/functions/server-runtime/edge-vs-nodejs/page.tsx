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
                    "step": 1,
                    "title": "런타임 세그먼트 설정(runtime: edge vs nodejs) 점검 및 Node.js 전용 모듈 및 Edge Web API 실행 호환성 검증",
                    "description": "각 라우트 파일 상단에 선언된 export const runtime 설정을 확인합니다. Node.js 환경의 fs/Buffer 지원과 Edge 환경의 초경량 V8 Isolate 제약 사항을 대조합니다.",
                    "actionBadge": "런타임 점검"
          },
          {
                    "step": 2,
                    "title": "런타임 분기별 성능 및 번들 격리 관찰",
                    "description": "런타임 선언에 따른 콜드스타트 속도와 사용 가능한 API 스펙 차이를 확인합니다.",
                    "actionBadge": "결과 검증",
                    "observe": "선언된 runtime 세그먼트 설정에 맞춰 실행 엔진(Node.js vs Edge)이 정확히 분기됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"Server Component runtime 분기 제어 실습"}>
        <ServerRuntimeEdgeNodeDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
