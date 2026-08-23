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
        title={"SSE 실시간 재고 스트리밍 (route.ts)"}
        concept={"route.ts가 ReadableStream을 text/event-stream으로 반환하면 연결이 끊기지 않고 서버가 재고 변동을 계속 밀어냅니다. 클라이언트는 폴링 없이 EventSource로 수신만 합니다."}
        steps={[
          {
            step: 1,
            title: "스트림 자동 연결 확인",
            description: "페이지 진입과 동시에 EventSource가 route.ts에 연결되어 재고 이벤트가 도착하기 시작합니다.",
            actionBadge: "SSE 연결",
          },
          {
            step: 2,
            title: "[스트림 일시중지] 클릭",
            description: "연결을 끊습니다. 서버가 보내던 재고 갱신이 화면에서 멈춥니다.",
            actionBadge: "연결 해제",
          },
          {
            step: 3,
            title: "[스트림 다시 연결] 클릭",
            description: "EventSource를 다시 열어 수신을 재개합니다.",
            actionBadge: "재연결",
            observe: "일시중지 구간에서 재고 수치와 수신 카운트가 멈췄다가 재연결 후 다시 증가하는지 대조",
            observeAt: "verification",
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
