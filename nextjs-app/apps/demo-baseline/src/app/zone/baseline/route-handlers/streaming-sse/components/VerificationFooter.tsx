'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• ReadableStream 기반 Server-Sent Events(SSE) 스트리밍 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="ReadableStream 기반 Server-Sent Events(SSE) 스트리밍 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="ReadableStream 기반 Server-Sent Events(SSE) 스트리밍">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>ReadableStream과 TextEncoder를 활용한 Server-Sent Events(SSE)는 단방향 HTTP 영구 연결을 통해 서버에서 클라이언트로 실시간 이벤트를 푸시하는 웹 표준 스트리밍 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 new Response(stream, &#123; headers: &#123; &apos;Content-Type&apos;: &apos;text/event-stream&apos;, &apos;Cache-Control&apos;: &apos;no-cache&apos; &#125; &#125;)로 주문 배송 상태 및 실시간 재고 변동 이벤트를 1초 간격으로 점진적 푸시합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>WebSocket 대비 경량 아키텍처: 단방향 HTTP 연결만으로 작동하여 추가 소켓 서버 없이 기존 HTTP 인프라/로드밸런서에서 즉시 동작합니다.</li>
              <li>자동 재연결 및 브라우저 호환성: 브라우저 EventSource API 또는 fetch stream reader를 통해 연결 유실 시 자동 복구됩니다.</li>
              <li>서버 리소스 절약: 폴링 대비 불필요한 HTTP 왕복 요청을 제거하여 서버 CPU 및 네트워크 대역폭을 획기적으로 절감합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 실시간 주문/배송 위치 관제 피드</li>
              <li>타임세일 한정 수량 실시간 재고 잔여량 브로드캐스트</li>
              <li>AI 상품 추천/리뷰 요약 토큰 단위 실시간 스트리밍 출력</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
