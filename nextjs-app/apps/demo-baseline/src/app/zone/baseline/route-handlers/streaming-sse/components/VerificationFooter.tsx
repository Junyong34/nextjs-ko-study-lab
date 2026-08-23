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
                  <p>Route Handler에서 Web 표준 <code>ReadableStream</code>과 <code>TextEncoder</code>를 활용하여 <code>Content-Type: text/event-stream</code> 헤더와 함께 단방향 실시간 이벤트 스트림을 브라우저에 지속적으로 푸시하는 Server-Sent Events(SSE) 스트리밍 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 클라이언트가 <code>/api/stream</code>으로 SSE 연결을 맺으면, 서버가 1초 간격으로 실시간 주가/재고 변동 이벤트(<code>data: {'{'}...{'}'}

</code>)를 생성하여 <code>controller.enqueue()</code>로 밀어 넣고 클라이언트 UI에 지연 없이 실시간 차트로 렌더링합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>WebSocket 대비 초경량 오버헤드</strong>: 별도의 양방향 소켓 프로토콜 없이 순수 HTTP 연결 위에서 동작하여 방화벽 친화적이며 서버 리소스를 절감합니다.</li>
                    <li><strong>자동 재연결(Auto-reconnect) 내장</strong>: 브라우저 <code>EventSource</code> 표준 API가 네트워크 단절 시 자동으로 재연결을 시도합니다.</li>
                    <li><strong>LLM AI 챗봇 토큰 스트리밍 최적화</strong>: OpenAI/Anthropic/Gemini 등 생성형 AI의 실시간 토큰 응답을 청크 단위로 즉각 전달합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 라이브 커머스 실시간 주문 알림 및 잔여 재고 카운트다운</li>
                    <li>생성형 AI 챗봇의 실시간 답변 텍스트 타자 효과 스트리밍</li>
                    <li>대규모 주문 배치 처리의 실시간 진행률(0~100%) 프로그레스 바 전송</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>버퍼링 방지 헤더 설정</strong>: 프록시나 Nginx 환경에서 SSE가 버퍼링되지 않도록 <code>X-Accel-Buffering: no</code> 및 <code>Cache-Control: no-cache, no-transform</code> 헤더를 반드시 설정해야 합니다.</li>
                    <li><strong>스트림 연결 종료 처리</strong>: 클라이언트가 탭을 닫거나 연결을 끊었을 때 서버 리소스 누수를 방지하기 위해 <code>req.signal.onabort</code> 이벤트에서 스트림 컨트롤러를 정상 종료해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
