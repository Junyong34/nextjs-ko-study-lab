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
        title={"route.ts SSE (Server-Sent Events) 실시간 재고 스트리밍"}
        concept={"Response 객체에 text/event-stream 헤더와 ReadableStream을 반환하여 1000ms 간격으로 실시간 재고 변동 데이터를 클라이언트에 푸시합니다."}
        steps={[
        {
        "step": 1,
        "title": "SSE 연결 수립 및 실시간 수신 확인",
        "description": "EventSource를 통해 route.ts 스트림에 연결되어 1초마다 재고 데이터가 수신되는지 확인합니다.",
        "actionBadge": "스트림 연결"
        },
        {
        "step": 2,
        "title": "[스트림 일시중지] 클릭",
        "description": "EventSource 연결을 close()하여 실시간 스트림 수신을 일시 중단합니다.",
        "actionBadge": "연결 해제"
        },
        {
        "step": 3,
        "title": "[스트림 다시 연결] 클릭",
        "description": "스트림을 재연결하여 최신 재고 이벤트 수신을 재개합니다.",
        "actionBadge": "재연결",
        "observe": "1000ms 주기 이벤트 카운트 증가와 3단 검증 패널의 SSE 연결 상태 동기화 확인",
        "observeAt": "verification"
        }
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
