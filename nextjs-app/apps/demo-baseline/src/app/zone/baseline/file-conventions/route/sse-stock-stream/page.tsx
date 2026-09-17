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
        concept={"Response 객체에 text/event-stream 헤더와 ReadableStream을 반환하여 2초 간격으로 실시간 재고 변동 데이터를 클라이언트에 푸시합니다. 클라이언트는 fetch()로 받은 response.body를 ReadableStream reader로 한 청크씩 직접 파싱합니다."}
        steps={[
        {
        "step": 1,
        "title": "SSE 연결 수립 및 실시간 수신 확인",
        "description": "fetch + response.body.getReader()로 route.ts 스트림에 연결되어 2초마다 재고 변동 이벤트가 하나씩 순차 수신되는지, 이벤트 로그의 시간차(Δ)로 확인합니다.",
        "actionBadge": "스트림 연결"
        },
        {
        "step": 2,
        "title": "[스트림 일시중지] 클릭",
        "description": "AbortController.abort()로 fetch 스트림 연결을 중단하고, 서버가 request.signal 'abort' 이벤트로 이를 감지해 정리하는지 확인합니다.",
        "actionBadge": "연결 해제"
        },
        {
        "step": 3,
        "title": "[스트림 다시 연결] 클릭",
        "description": "스트림을 재연결하여 최신 재고 이벤트 수신을 재개합니다.",
        "actionBadge": "재연결",
        "observe": "2초 주기 이벤트 카운트 증가와 3단 검증 패널의 SSE 연결 상태 동기화 확인",
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
