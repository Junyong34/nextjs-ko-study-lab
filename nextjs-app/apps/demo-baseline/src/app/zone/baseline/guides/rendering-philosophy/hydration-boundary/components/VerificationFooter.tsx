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

  const defaultExpected = "• Hydration 경계와 번들 격리의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Hydration 경계와 번들 격리 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="React 19 Hydration Boundary & 서버-클라이언트 정합성">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>React 19의 Hydration Boundary는 서버에서 사전 렌더링된 정적 HTML 마크업과 브라우저에서 실행되는 자바스크립트 Virtual DOM을 일치시키는 과정입니다. 타임존 차이나 브라우저 전용 API로 인한 Hydration Mismatch를 줄이고 복구하는 방법을 확인할 수 있습니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>이 예제에서는 서버 시간과 클라이언트 로컬 시간의 차이로 발생할 수 있는 Hydration 오류를 설명하고, <code>useEffect</code>의 마운트 플래그(<code>isMounted</code>)와 <code>suppressHydrationWarning</code> 속성을 사용해 차이를 다루는 방법을 보여 줍니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>UI 깨짐 및 렌더링 깜빡임 방지</strong>: 서버 HTML과 클라이언트 VDOM 불일치로 인해 React가 전체 DOM 트리를 다시 그리는 성능 저하를 차단합니다.</li>
                    <li><strong>정확한 로컬라이제이션</strong>: 서버에서는 UTC 기준 마크업을 렌더링하고, 클라이언트 Hydration 이후 사용자의 로컬 브라우저 타임존과 통화 기호로 전환합니다.</li>
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
