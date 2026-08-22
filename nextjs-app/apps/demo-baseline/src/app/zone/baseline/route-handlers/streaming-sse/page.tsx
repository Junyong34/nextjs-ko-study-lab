import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SseStreamClient } from './components/SseStreamClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function StreamingSseDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="ReadableStream 기반 Server-Sent Events(SSE) 스트리밍"
        concept="Route Handler는 Web Streams API의 ReadableStream을 반환하여, 전체 처리가 완료될 때까지 기다리지 않고 실시간 텔레메트리 데이터나 AI 토큰을 클라이언트에 청크 단위로 지속 스트리밍할 수 있습니다."
        steps={[
          {
            step: 1,
            title: '[▶ SSE 스트리밍 시작] 클릭',
            description: '엔드포인트(/api/sse)로 EventSource 연결을 수립합니다.',
            actionBadge: 'HTTP 스트림 오픈',
          },
          {
            step: 2,
            title: '실시간 패킷 수신 관찰',
            description: '서버에서 700ms 간격으로 푸시하는 CPU/메모리 텔레메트리 패킷(#1~#6)을 확인합니다.',
            actionBadge: 'ReadableStream 청크',
          },
          {
            step: 3,
            title: '스트림 자동 종료 및 해제',
            description: '6개 패킷 전송 후 controller.close()가 호출되어 연결이 깔끔하게 정리되는 것을 확인합니다.',
            actionBadge: '스트림 닫기(close)',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Next.js 실시간 SSE 스트리밍 모니터 (/api/sse)" className="space-y-4">
        <SseStreamClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
