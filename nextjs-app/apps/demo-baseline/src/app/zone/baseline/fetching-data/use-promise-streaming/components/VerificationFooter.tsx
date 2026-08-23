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

  const defaultExpected = "• React 19 use(Promise) & Suspense 스트리밍 패칭 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="React 19 use(Promise) & Suspense 스트리밍 패칭 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="React 19 use(Promise) & Suspense 스트리밍 패칭">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>React 19의 <code>use()</code> API는 Server Component에서 생성한 미해결(Pending) <code>Promise</code> 객체를 Client Component에 Props로 전달하고, 클라이언트 렌더 단계에서 <code>use(promise)</code>로 언래핑하여 <code>{'<'}Suspense{'>'}</code> 바운더리와 결합된 점진적 스트리밍을 구현하는 표준 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 서버에서 즉시 반환된 기본 상품 정보와 2초 지연되는 실시간 재고/배송 Promise를 클라이언트 컴포넌트에 주입합니다. 기본 셸이 즉시 표시된 후 Promise 완료 시점에 스켈레톤이 실제 재고 데이터로 전환됩니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>0ms 초기 셸 렌더링</strong>: 백엔드 지연 데이터가 준비되기 전에도 레이아웃과 정적 콘텐츠를 사용자 브라우저에 즉시 전송합니다.</li>
                    <li><strong>폭포수 없는 클라이언트 수신</strong>: 클라이언트가 별도의 <code>useEffect</code> + <code>fetch</code>를 재호출하지 않고 서버에서 시작된 단일 스트림을 그대로 소비합니다.</li>
                    <li><strong>선언적 로딩 상태 관리</strong>: <code>useState</code>와 <code>useEffect</code> 기반의 수동 로딩 플래그 제어를 제거하고 Suspense 폴백으로 일원화합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>상품 상세 페이지의 실시간 물류센터별 배송 도착 예정일 및 잔여 재고 수량 표시</li>
                    <li>예약 시스템의 실시간 좌석 예약 가능 여부 및 할인 쿠폰 적용 견적 스트리밍</li>
                    <li>결제 대기 화면의 PG 승인 상태 폴링 및 최종 영수증 데이터 수신</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Promise 인스턴스 재생성 방지</strong>: Server Component에서 매 렌더마다 새 Promise 객체를 생성하여 전달하면 불필요한 리렌더가 발생할 수 있으므로 컴포넌트 렌더 외부나 캐시된 데이터 함수를 사용해야 합니다.</li>
                    <li><strong>에러 바운더리 필수 배치</strong>: <code>use(promise)</code>가 reject되면 가장 가까운 Error Boundary로 예외가 전파되므로 <code>{'<'}Suspense{'>'}</code> 외부에 <code>{'<'}ErrorBoundary{'>'}</code>를 반드시 함께 배치해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
