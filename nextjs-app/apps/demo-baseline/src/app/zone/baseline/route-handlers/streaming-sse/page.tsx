import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SseStreamClient } from './components/SseStreamClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function StreamingSseDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Route Handler ReadableStream & Server-Sent Events(SSE) 실시간 스트리밍"
        concept="route.ts에서 Web 표준 ReadableStream을 NextResponse로 반환하고 text/event-stream 헤더를 설정하여 1초 간격으로 실시간 주가/재고 청크 이벤트를 클라이언트에 지속 푸시합니다."
        steps={[
          {
            step: 1,
            title: '[▶ SSE 스트리밍 시작] 클릭',
            description: '버튼을 클릭하여 /api/... SSE 엔드포인트와 EventSource/fetch ReadableStream 연결을 엽니다.',
            actionBadge: 'SSE 연결',
          },
          {
            step: 2,
            title: '실시간 스트림 청크 수신 확인',
            description: '1초 간격으로 서버에서 푸시되는 실시간 시세 변동 데이터(청크 #1~#5)가 순차 도착하는 것을 확인합니다.',
            actionBadge: '청크 수신',
          },
          {
            step: 3,
            title: '[⏹ 스트림 중단] 클릭 및 연결 해제 관찰',
            description: '[⏹ 스트림 중단] 버튼을 눌러 컨트롤러 스트림이 안전하게 닫히는 것을 관찰합니다.',
            actionBadge: '스트림 닫기',
            observe: '1초 간격으로 도착하는 SSE 실시간 이벤트 데이터(event: stock-update)가 로그에 순차 누적되고 종료됨',
            observeAt: 'playground',
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
