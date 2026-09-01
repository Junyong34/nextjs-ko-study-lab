'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  isConnected?: boolean
  ticksReceived?: number
}

export function VerificationFooter({
  isConnected = false,
  ticksReceived = 0,
}: VerificationFooterProps) {
  const isMatched = isConnected || ticksReceived > 0

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="실시간 재고 스트리밍 (SSE route.ts) 검증 결과"
        expected="• route.ts에서 ReadableStream을 생성하고 Content-Type: text/event-stream으로 지속적인 청크 스트리밍\n• 클라이언트에서 실시간 재고 틱(tick) 데이터 수신"
        actual={
          ticksReceived > 0
            ? `• [SSE 스트리밍 활성] 실시간 재고 변동 틱 ${ticksReceived}회 수신 완료\n• ReadableStream 청크 정상 파싱 및 상태 동기화`
            : isConnected
            ? '• [SSE 스트림 연결 수립] 초기 데이터 수신 및 첫 번째 틱 대기 중...'
            : '• SSE 스트림 대기 상태'
        }
        isMatched={isMatched}
        description="Next.js App Router route.ts의 Web Streams API (ReadableStream)를 활용하여 SSE 스트리밍이 정상 작동하는지 대조 검증합니다."
      />
      <DemoDeepDiveCard title="실시간 재고 스트리밍 (SSE route.ts) & ReadableStream 파이프라인">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Server-Sent Events(SSE)는 HTTP 연결 위에서 서버가 클라이언트로 데이터를 단방향 푸시하는 웹 표준 프로토콜입니다. Next.js App Router <code>route.ts</code>는 <code>ReadableStream</code>과 <code>TextEncoder</code>를 활용하여 <code>Content-Type: text/event-stream</code> 헤더와 함께 실시간 청크를 지속 스트리밍합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>route.ts</code> 엔드포인트가 주기적 타이머를 통해 실시간 재고 변동 틱(Tick) 이벤트를 <code>data: {'{'}...{'}'}\n\n</code> 포맷으로 인코딩하여 푸시하고, 브라우저가 이를 실시간으로 파싱하여 재고 수량 UI를 즉시 동기화합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>WebSocket 대비 초경량 아키텍처</strong>: 표준 HTTP/2 또는 HTTP/3 연결을 공유하여 별도의 웹소켓 전용 서버 구축 및 포트 관리 오버헤드가 없습니다.</li>
              <li><strong>브라우저 자동 재연결 내장</strong>: <code>EventSource</code> 표준 API를 통해 네트워크 단절 시 자동으로 재연결을 시도합니다.</li>
              <li><strong>실시간 서버 푸시 최적화</strong>: LLM 챗봇 토큰 스트리밍, 대시보드 실시간 지표 갱신, 주문 처리 현황 피드백에 최적입니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 타임세일 실시간 잔여 재고 카운트다운</li>
              <li>결제 승인 및 배송 상태 단계별 실시간 진행률 알림</li>
              <li>AI 쇼핑 어시스턴트 추천 텍스트 토큰 스트리밍</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>force-dynamic 선언 및 버퍼링 차단</strong>: SSE 엔드포인트에는 <code>export const dynamic = 'force-dynamic'</code> 선언이 필수이며, 프록시/CDN 버퍼링으로 인한 지연을 막기 위해 <code>Cache-Control: no-cache, no-transform</code> 및 <code>x-accel-buffering: no</code> 헤더를 설정해야 합니다.</li>
              <li><strong>스트림 클린업(Cancelation) 처리</strong>: 클라이언트가 브라우저 창을 닫았을 때 서버 리소스 누수를 방지하기 위해 <code>ReadableStream</code>의 <code>cancel()</code> 콜백에서 타이머나 DB 구독을 반드시 해제해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
