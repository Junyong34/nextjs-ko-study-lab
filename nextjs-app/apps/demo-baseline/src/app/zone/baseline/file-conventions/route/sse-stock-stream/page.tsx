'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SseStockStreamDemo } from './components/SseStockStreamDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [streamState, setStreamState] = useState<{
    isConnected: boolean
    ticksReceived: number
  }>({
    isConnected: false,
    ticksReceived: 0,
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="실시간 재고 스트리밍 (SSE route.ts)"
        concept="Next.js App Router의 route.ts에서 ReadableStream을 생성하여 클라이언트로 Server-Sent Events(text/event-stream)를 실시간 스트리밍하는 실습입니다."
        steps={[
          {
            step: 1,
            title: "ReadableStream 기반 SSE 엔드포인트",
            description: "api/route.ts에서 force-dynamic 설정과 함께 text/event-stream 응답 스트림을 생성합니다.",
            actionBadge: "스트림 엔드포인트",
          },
          {
            step: 2,
            title: "클라이언트 스트림 구독",
            description: "fetch와 ReadableStream.getReader()를 통해 서버가 푸시하는 재고 틱을 실시간 수신합니다.",
            actionBadge: "청크 수신",
          },
          {
            step: 3,
            title: "실시간 재고 틱 렌더링",
            description: "수신된 재고 변동 이벤트를 대시보드 상태에 동기화하고 검증 패널에 반영합니다.",
            actionBadge: "실시간 동기화",
          },
        ]}
      />
      <DemoPlaygroundCard title="실시간 재고 스트리밍 (SSE route.ts) 실습">
        <SseStockStreamDemo onStatusChange={setStreamState} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isConnected={streamState.isConnected}
        ticksReceived={streamState.ticksReceived}
      />
    </DemoContainer>
  )
}
