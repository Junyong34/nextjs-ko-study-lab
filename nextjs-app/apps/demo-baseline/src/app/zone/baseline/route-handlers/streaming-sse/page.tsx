import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'route-handlers/streaming-sse')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SseStreamClient } from './components/SseStreamClient'

export default function StreamingSseDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Route Handler ReadableStream & Server-Sent Events(SSE) 실시간 스트리밍"
        concept="route.ts에서 Web 표준 ReadableStream을 반환하고 text/event-stream 헤더를 설정하여 700ms 간격으로 실시간 시스템 텔레메트리 청크 이벤트를 클라이언트에 지속 푸시합니다."
        steps={[
          {
            step: 1,
            title: '[▶ SSE 스트리밍 시작] 클릭',
            description: '버튼을 클릭하여 /api/sse 엔드포인트와 EventSource 연결을 엽니다.',
            actionBadge: 'SSE 연결',
          },
          {
            step: 2,
            title: '실시간 스트림 청크 수신 확인',
            description: '700ms 간격으로 서버에서 푸시되는 실시간 텔레메트리 데이터(패킷 #1~#6)가 순차 도착하는 것을 확인합니다.',
            actionBadge: '청크 수신',
          },
          {
            step: 3,
            title: '[⏹ 스트림 중단] 클릭 및 연결 해제 관찰',
            description: '[⏹ 스트림 중단] 버튼을 눌러 컨트롤러 스트림이 안전하게 닫히고 연결이 종료되는 과정을 관찰합니다.',
            actionBadge: '스트림 닫기',
            observe: '700ms 간격으로 도착하는 SSE 실시간 텔레메트리 데이터 패킷이 콘솔에 누적되고 스트림이 정상 종료됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) 및 3단/4단 */}
      <DemoPlaygroundCard title="Next.js 실시간 SSE 스트리밍 모니터 (/api/sse)" className="space-y-4">
        <SseStreamClient />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
