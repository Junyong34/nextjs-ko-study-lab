'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface SsePacket {
  step?: number
  timestamp?: string
  serverCpu?: number
  memoryUsage?: string
  message?: string
  status?: string
}

export interface VerificationFooterProps {
  packets?: SsePacket[]
  isConnected?: boolean
  isCompleted?: boolean
  isAborted?: boolean
}

export function VerificationFooter({
  packets = [],
  isConnected = false,
  isCompleted = false,
  isAborted = false,
}: VerificationFooterProps) {
  const packetCount = packets.length
  const lastPacket = packets[packets.length - 1]

  const isMatched =
    isCompleted && packetCount >= 6
      ? true
      : isAborted
      ? false
      : undefined

  const expected =
    '• Content-Type: text/event-stream 연결을 통해 700ms 간격으로 6개 텔레메트리 패킷 순차 수신\n• status: completed 정상 수신 및 스트림 안전 종료'

  const actual =
    packetCount === 0 && !isConnected
      ? '• SSE 스트리밍 대기 중 (상단 [▶ SSE 스트리밍 시작] 버튼을 클릭하세요)'
      : isConnected && !isCompleted
      ? `• SSE 스트리밍 수신 중: ${packetCount}/6 패킷 도달 (최근 CPU: ${lastPacket?.serverCpu || 0}%, MEM: ${lastPacket?.memoryUsage || '0'} MB)`
      : isCompleted
      ? `• 6개 텔레메트리 패킷 수신 완료 (최종 메모리: ${lastPacket?.memoryUsage} MB, CPU: ${lastPacket?.serverCpu}%)\n• status: completed 정상 수신 및 스트림 안전 종료 (Content-Type: text/event-stream)`
      : isAborted
      ? `• 스트림 중단됨: ${packetCount}/6 패킷 수신 후 사용자 중단 (EventSource.close 호출)`
      : '• 스트림 상태 갱신 대기 중'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="ReadableStream 기반 Server-Sent Events(SSE) 스트리밍 실증 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="Route Handler의 Web ReadableStream과 클라이언트 EventSource 간의 실시간 스트리밍 라이프사이클을 실증 검증합니다."
      />
      <DemoDeepDiveCard title="ReadableStream 기반 Server-Sent Events(SSE) 스트리밍">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Route Handler에서 Web 표준 <code>ReadableStream</code>과 <code>TextEncoder</code>를 활용하여 <code>Content-Type: text/event-stream</code> 헤더와 함께 단방향 실시간 이벤트 스트림을 브라우저에 지속적으로 푸시하는 Server-Sent Events(SSE) 스트리밍 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 클라이언트가 <code>/api/sse</code>로 SSE 연결을 맺으면, 서버가 700ms 간격으로 실시간 시스템 텔레메트리 이벤트(<code>data: {'{...}'}</code>)를 생성하여 <code>controller.enqueue()</code>로 전송하고, 6개 패킷 전송 후 <code>controller.close()</code>로 안전하게 스트림을 닫습니다. 클라이언트 중단 시 <code>req.signal</code>의 abort 이벤트를 감지하여 리소스 누수를 방지합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>WebSocket 대비 초경량 오버헤드</strong>: 별도의 양방향 소켓 프로토콜 없이 순수 HTTP 연결 위에서 동작하여 방화벽 친화적이며 서버 리소스를 절감합니다.</li>
              <li><strong>자동 재연결(Auto-reconnect) 내장</strong>: 브라우저 <code>EventSource</code> 표준 API가 네트워크 단절 시 자동으로 재연결을 시도합니다.</li>
              <li><strong>LLM AI 챗봇 토큰 스트리밍 최적화</strong>: 생성형 AI의 실시간 토큰 응답을 청크 단위로 즉각 전달합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 실시간 시스템 모니터링 및 서버 리소스 텔레메트리 대시보드</li>
              <li>대규모 주문 배치 처리의 실시간 진행률(0~100%) 프로그레스 전송</li>
              <li>생성형 AI 모델의 실시간 토큰 스트리밍 응답</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>버퍼링 방지 헤더 설정</strong>: 프록시나 Nginx 환경에서 SSE가 버퍼링되지 않도록 <code>Cache-Control: no-cache, no-transform</code> 헤더를 반드시 설정해야 합니다.</li>
              <li><strong>스트림 연결 종료 처리</strong>: 클라이언트 연결 종료 시 <code>request.signal.addEventListener('abort')</code>로 인터벌 타이머를 해제해야 메모리 누수가 발생하지 않습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
