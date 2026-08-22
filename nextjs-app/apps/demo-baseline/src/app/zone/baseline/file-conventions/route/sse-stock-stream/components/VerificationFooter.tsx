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
        title="실시간 재고 스트리밍 (SSE route.ts) 실증 검증"
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
      <DemoDeepDiveCard title="실시간 재고 스트리밍 (SSE route.ts)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Server-Sent Events(SSE)는 단방향 실시간 데이터 스트리밍을 위한 웹 표준 프로토콜입니다.
              Next.js App Router <code>route.ts</code>는 <code>ReadableStream</code>을 반환하여 연결을 유지하면서 <code>data: ...\n\n</code> 형식의 텍스트 청크를 지속적으로 푸시할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. force-dynamic 및 버퍼링 비활성화</h5>
            <p>
              SSE 엔드포인트는 정적 빌드 시점에 캐시되지 않도록 <code>export const dynamic = 'force-dynamic'</code>을 선언해야 합니다.
              또한 프록시나 CDN에서 버퍼링되어 지연되는 것을 방지하기 위해 <code>Cache-Control: no-cache, no-transform</code> 및 <code>x-accel-buffering: no</code> 헤더를 지정합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>WebSocket 대비 가벼운 구조: HTTP/2 또는 HTTP/3 연결 위에서 가볍게 동작하며 별도의 웹소켓 서버가 불필요합니다.</li>
              <li>자동 재연결: 브라우저 표준 <code>EventSource</code>는 네트워크 단절 시 자동으로 재연결을 시도합니다.</li>
              <li>서버 푸시 최적화: LLM 생성 텍스트 스트리밍, 대시보드 지표 업데이트, 주문 진행 상태 실시간 표시에 최적입니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 타임세일 실시간 잔여 재고 카운트다운</li>
              <li>AI 챗봇 답변 텍스트 토큰 단위 스트리밍</li>
              <li>배송 상태 추적 및 결제 처리 단계별 진행률 피드백</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
