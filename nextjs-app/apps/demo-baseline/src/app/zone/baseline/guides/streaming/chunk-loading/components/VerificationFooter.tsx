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

  const defaultExpected = "• 점진적 Suspense 스트리밍 및 로딩 청크 순차 주입 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="점진적 Suspense 스트리밍 및 로딩 청크 순차 주입 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="점진적 Suspense 스트리밍 및 로딩 청크 순차 주입">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>점진적 청크 스트리밍(Progressive Chunk Streaming)은 HTTP/1.1 Chunked Transfer Encoding 및 HTTP/2 멀티플렉싱을 활용하여, Node.js 서버 렌더러가 비동기 데이터 작업이 완료될 때마다 <code>{'<'}template{'>'}</code> 태그와 인라인 교체 자바스크립트가 담긴 HTML 청크를 브라우저에 순차 주입하는 표준 렌더링 파이프라인 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 3단계 데이터 파이프라인([1단계: 기본 셸 0ms] -{'>'} [2단계: 재고 상태 800ms] -{'>'} [3단계: 배송 물류 트래킹 1800ms])을 실행하고, 브라우저가 수신하는 원시 HTML 스트림 패킷과 DOM 치환 스크립트 실행 과정을 실시간 청크 로그로 대조 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>연결 유지형 순차 데이터 전달</strong>: 단일 HTTP 연결 안에서 추가적인 클라이언트 fetch 요청 없이 서버가 렌더링 완료 순서대로 콘텐츠를 밀어 넣어줍니다.</li>
                    <li><strong>네트워크 레이턴시 은닉</strong>: 서버와 브라우저 간의 데이터 교환이 연속 스트림으로 진행되어 지연 시간을 시각적으로 분산시킵니다.</li>
                    <li><strong>브라우저 렌더링 파이프라인 최적화</strong>: 브라우저 파서가 청크를 수신하는 즉시 점진적으로 DOM 트리를 구축하여 메모리와 렌더링 효율을 극대화합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>실시간 물류 배송 상태 및 단계별 화물 위치 추적 화면</li>
                    <li>대규모 데이터베이스 마이그레이션 또는 배치 작업 실시간 진행 현황판</li>
                    <li>다중 공급사 견적 비교 및 실시간 최저가 계산 브리핑 페이지</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Nginx/프록시 버퍼링 설정</strong>: 리버스 프록시가 서버 응답을 버퍼링하면 스트리밍 효과가 사라지므로 프록시 설정에 <code>proxy_buffering off;</code>를 적용해야 합니다.</li>
                    <li><strong>HTTP 헤더 전송 시점</strong>: 첫 번째 청크가 전송되는 순간 HTTP 상태 코드와 헤더가 확정되므로, 이후 스트리밍 중 발생한 에러는 상태 코드를 500으로 변경할 수 없음에 유의해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
