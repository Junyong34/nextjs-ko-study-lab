import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/opentelemetry/trace-span')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OpenTelemetryDemo } from './components/OpenTelemetryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"OpenTelemetry 분산 추적(Distributed Tracing) 및 Span 측정"}
        concept={"Next.js 내장 OpenTelemetry 지원을 통해 페이지 렌더링(render /shop, 32ms)과 DB 쿼리(fetch db.query, 18ms)의 소요 시간을 Span 단위로 정밀 계측하고 분산 Trace ID를 생성합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "생성된 Trace ID(4bf92f3577b34da6...) 확인 및 페이지 렌더링 Span(render /shop/products, 32ms) 측정치 분석",
                    "description": "모든 마이크로서비스 요청을 관통하는 128비트 분산 추적 식별자를 점검합니다. Next.js 서버 컴포넌트 렌더링에 소요된 세부 실행 시간을 확인합니다.",
                    "actionBadge": "Trace ID 확인"
          },
          {
                    "step": 2,
                    "title": "DB 쿼리 Span(SELECT * FROM items, 18ms) 병목 진단 관찰",
                    "description": "분산 환경에서 어떤 I/O 작업이 지연을 유발하는지 Span 계측 트리로 시각화되는지 검증합니다.",
                    "actionBadge": "분산 추적 검증",
                    "observe": "OpenTelemetry Span 트리 분석을 통한 렌더링(32ms) 및 DB 쿼리(18ms) 정밀 소요 시간 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"Trace ID 발급 및 Server Component Span 실습"}>
        <OpenTelemetryDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
