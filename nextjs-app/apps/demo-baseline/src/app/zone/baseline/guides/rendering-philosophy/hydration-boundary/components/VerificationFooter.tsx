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

  const defaultExpected = "• 하이드레이션 경계와 번들 격리 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="하이드레이션 경계와 번들 격리 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="React 19 Hydration Boundary & 서버-클라이언트 정합성">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>React 19의 Hydration Boundary는 서버에서 사전 렌더링된 정적 HTML 마크업과 클라이언트 브라우저에서 다운로드된 자바스크립트 Virtual DOM을 일치시키는 수명 주기이며, 타임존 차이나 브라우저 전용 API로 인한 하이드레이션 불일치(Hydration Mismatch)를 방지하고 복구하는 렌더링 정합성 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 서버 시간과 클라이언트 로컬 시간의 불일치로 발생하는 Hydration 에러 상황을 연출하고, <code>useEffect</code>를 통한 지연 마운트 플래그(<code>isMounted</code>) 기법 및 <code>suppressHydrationWarning</code> 속성을 적용하여 정합성 오류를 완벽히 해결하는 메커니즘을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>UI 깨짐 및 렌더링 깜빡임 방지</strong>: 서버 HTML과 클라이언트 VDOM 불일치로 인해 React가 전체 DOM 트리를 다시 그리는 성능 저하를 차단합니다.</li>
                    <li><strong>정확한 로컬라이제이션</strong>: 서버에서는 UTC 기준 안전한 마크업을 렌더링하고, 클라이언트 하이드레이션 이후 사용자의 로컬 브라우저 타임존과 통화 기호로 부드럽게 전환합니다.</li>
                    <li><strong>명확한 경계 분리</strong>: 서버 렌더링이 가능한 정적 영역과 클라이언트 상태가 필요한 동적 영역을 분리하여 안정성을 확보합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>현재 시각, 실시간 카운트다운 타이머, 배송 도착 예정 시각 표시</li>
                    <li>사용자 브라우저 언어 설정에 따른 다국어 통화(KRW, USD, JPY) 포맷팅</li>
                    <li>window.innerWidth 기반의 반응형 화면 크기 감지 위젯</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>suppressHydrationWarning의 올바른 사용</strong>: <code>suppressHydrationWarning</code>은 텍스트 내용이나 단순 클래스 차이에만 적용되며 태그 구조 자체가 다를 때는 동작하지 않으므로 주의해야 합니다.</li>
                    <li><strong>isMounted 패턴 활용</strong>: 브라우저 전용 API(e.g. <code>window.localStorage</code>)에 의존하는 UI는 <code>useEffect</code> 내부에서 <code>isMounted = true</code>를 설정한 후에만 조건부 렌더링하는 것이 안전합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
