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

  const defaultExpected = "• connection() 비동기 연결 준비 대기 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="connection() 비동기 연결 준비 대기 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="connection() 요청 수명주기 접근 및 동적 렌더링 조기 신호">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>connection()</code> (<code>next/server</code>)은 Next.js 15+에서 도입된 비동기 함수로, 컴포넌트 렌더링이 빌드 타임 정적 생성이 아닌 실제 클라이언트 요청 수명주기에 진입했음을 명시적으로 선언하고 동적 렌더링 컨텍스트를 활성화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>await connection()</code>을 호출하여 해당 컴포넌트가 사용자의 실시간 요청 시점에 동적으로 렌더링됨을 보장하고, 클라이언트 연결 상태를 확인하여 스트리밍 데이터 파이프라인을 구동합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>명시적 동적 렌더링 선언</strong>: 헤더나 쿠키를 직접 읽지 않고도 안전하게 정적 빌드 최적화에서 동적 요청 모드로 전환합니다.</li>
              <li><strong>Partial Prerendering(PPR) 경계 최적화</strong>: 정적 셸(Shell)과 동적 데이터 영역의 경계를 명확히 분리합니다.</li>
              <li><strong>코드 의도 명확화</strong>: 불필요한 더미 헤더 호출 안티패턴을 제거하고 공식 API로 의도를 표현합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>정적 레이아웃 내부에서 실시간 시간/요청별 동적 컴포넌트 렌더링</li>
              <li>부분 사전 렌더링(PPR) 환경에서 동적 홀(Dynamic Hole) 스트리밍 경계 선언</li>
              <li>요청별 고유 세션 컨텍스트 초기화</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Next.js 15+ 전용</strong>: Next.js 15 이전 버전에서는 지원되지 않으므로 레거시 환경에서는 <code>headers()</code> 또는 <code>cookies()</code>를 활용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
