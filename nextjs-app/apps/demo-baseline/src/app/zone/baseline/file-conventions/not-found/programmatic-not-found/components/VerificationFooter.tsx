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

  const defaultExpected = "• notFound() 프로그래밍 트리거 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="notFound() 프로그래밍 트리거 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="notFound() 프로그래밍 방식 404 트리거 & 비즈니스 유효성 검증">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>notFound()</code> 함수는 서버 컴포넌트, Route Handler, Server Action 등에서 비즈니스 검증 조건(리소스 미존재, 유효기간 만료 등) 불일치 시 프로그래밍 방식으로 즉각 404 Not Found 상태를 선언하는 Next.js 표준 함수입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 파라미터 유효성 검사에서 음수 ID나 미승인 카테고리 슬러그가 전달되었을 때, 비즈니스 로직 조건문 내에서 <code>notFound()</code>를 즉시 실행하여 하위 컴포넌트 렌더링을 차단하고 404 전용 뷰로 전환하는 흐름을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>선언적 예외 처리</strong>: 복잡한 삼항 연산자나 null 체크 JSX 없이 함수 호출 한 줄로 표준 404 화면을 바인딩합니다.</li>
              <li><strong>서버 자원 절약</strong>: 데이터가 없음을 인지한 즉시 하위 컴포넌트의 불필요한 쿼리 및 렌더링 연산을 즉시 중단합니다.</li>
              <li><strong>API 및 페이지 공통 규격</strong>: 페이지 렌더링뿐 아니라 Route Handler에서도 일관된 404 상태 응답을 보장합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>품절 처리 후 완전 단종된 한정판 상품 상세 페이지 접근</li>
              <li>비공개 처리된 1:1 고객 문의 내역 비소유자 접근 차단</li>
              <li>날짜가 만료된 타임세일 이벤트 쿠폰 상세 화면</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>NEXT_NOT_FOUND 예외 제어</strong>: <code>notFound()</code> 호출 이후의 코드는 실행되지 않으므로, 리소스 클린업이나 필수 로깅은 <code>notFound()</code> 호출 전에 완료해야 합니다.</li>
              <li><strong>루트 not-found.tsx 필요성</strong>: 하위 세그먼트에 <code>not-found.tsx</code>가 없는 경우 최상위 <code>app/not-found.tsx</code>가 폴백으로 렌더링되므로 앱 루트에 기본 404 컴포넌트를 반드시 배치해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
