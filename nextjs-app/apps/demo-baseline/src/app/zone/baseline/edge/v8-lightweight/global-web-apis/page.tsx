import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { EdgeV8WebApisDemo } from './components/EdgeV8WebApisDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="Edge Runtime V8 글로벌 Web APIs 초고속 실행"
        concept="V8 Isolate 기반 Edge Runtime 환경에서 Request, Response, Web Crypto(crypto.subtle), TransformStream 등의 표준 Web API를 0ms 콜드 스타트로 고속 실행합니다."
        steps={[
          {
                    "step": 1,
                    "title": "Edge V8 런타임 표준 Web APIs 지원 명세 점검 및 Web Crypto 기반 SHA-256 서명 생성 실행",
                    "description": "Fetch, Web Streams, Web Crypto, TextEncoder 등 엣지에서 지원되는 표준 API 목록을 확인합니다. crypto.subtle.digest를 호출하여 초고속으로 결제 위변조 방지 해시 서명을 계산합니다.",
                    "actionBadge": "API 명세 점검"
          },
          {
                    "step": 2,
                    "title": "0ms 콜드 스타트 및 초저지연 실행 결과 관찰",
                    "description": "Node.js VM 구동 지연 없이 전 세계 엣지 노드에서 즉시 연산된 결과가 반환되는지 확인합니다.",
                    "actionBadge": "결과 검증",
                    "observe": "Edge Runtime V8 엔진에서 표준 Web Crypto 연산이 0ms 콜드 스타트로 즉시 완수됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"Edge Runtime V8 글로벌 Web APIs 초고속 실행 실습"}>
        <EdgeV8WebApisDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
