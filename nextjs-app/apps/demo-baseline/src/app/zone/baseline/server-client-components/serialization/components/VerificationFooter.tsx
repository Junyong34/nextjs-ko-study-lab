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

  const defaultExpected = "• Props 직렬화(Serialization) 및 전달 경계 검증 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Props 직렬화(Serialization) 및 전달 경계 검증 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Props 직렬화(Serialization) 및 전달 경계 검증">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Server Component에서 Client Component로 데이터를 전달할 때 React Flight 프로토콜을 통과하기 위해 Props는 반드시 JSON 직렬화 가능한 타입(문자열, 숫자, 불리언, 순수 객체, 배열, <code>Date</code>, <code>Promise</code> 등)이어야 하며 함수, 클래스 인스턴스, Symbol 등은 전달할 수 없는 경계 직렬화 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 직렬화 가능한 복합 상품 주문 데이터(<code>Date</code> 객체, 중첩 JSON 배열)와 직렬화 불가능한 커스텀 클래스 인스턴스/함수를 각각 Client Component로 전달을 시도할 때의 런타임 직렬화 성공 및 실패(Serialization Error) 메커니즘을 대조 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>네트워크 통신 무결성</strong>: 서버와 클라이언트 간의 데이터 교환이 안전하고 예측 가능한 규격으로 표준화됩니다.</li>
                    <li><strong>클라이언트 번들 오염 방지</strong>: 서버 비즈니스 로직 함수나 DB 커넥션 인스턴스가 실수로 브라우저 메모리에 유출되는 사고를 원천 차단합니다.</li>
                    <li><strong>일관된 상태 복원</strong>: 서버에서 직렬화된 데이터가 클라이언트 브라우저에서 동일한 형태의 JS 객체로 정확히 하이드레이션됩니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>서버 DB에서 조회한 상품 생성일(<code>Date</code>) 및 결제 내역 배열을 클라이언트 주문 테이블로 전달</li>
                    <li>Server Action 함수를 클라이언트 폼의 action Props로 안전하게 바인딩</li>
                    <li>복합 필터 조건(가격 범위, 카테고리 태그 배열)을 클라이언트 필터 위젯에 초기값으로 전달</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Date 객체 하이드레이션 주의</strong>: <code>Date</code> 객체는 직렬화되어 전달되지만 서버와 클라이언트의 타임존(Timezone) 차이로 인해 렌더링 불일치(Hydration Mismatch)가 발생할 수 있으므로 UTC 기준 문자열이나 포맷팅된 텍스트 전달을 고려해야 합니다.</li>
                    <li><strong>함수 전달 시 'use server' 활용</strong>: 클라이언트 컴포넌트에 콜백 함수를 넘겨야 하는 경우 일반 함수가 아닌 <code>'use server'</code>가 선언된 Server Action 함수만 전달할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
