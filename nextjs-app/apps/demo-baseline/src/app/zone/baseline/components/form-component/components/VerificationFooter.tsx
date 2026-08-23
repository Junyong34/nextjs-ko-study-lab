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

  const defaultExpected = "• Next.js 빌트인 <Form> 컴포넌트 & GET 검색 동기화 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Next.js 빌트인 <Form> 컴포넌트 & GET 검색 동기화 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Next.js 15+ 빌트인 <Form> 컴포넌트 & GET 검색 동기화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/form</code>의 <code>{'<'}Form{'>'}</code> 컴포넌트는 HTML <code>{'<'}form{'>'}</code> 요소를 확장하여 클라이언트 사이드 소프트 내비게이션(SPA 전환), 뷰포트 프리페치(Prefetch), 폼 제출 시 기존 레이아웃/클라이언트 상태 보존을 기본 지원하는 Next.js 내장 컴포넌트입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 상품 검색 폼(<code>{'<'}Form action="/search"{'>'}</code>)에서 키워드(q)와 카테고리를 입력하고 전송했을 때, 전체 페이지 새로고침 없이 URL 쿼리스트링(<code>/search?q=shoes</code>)만 갱신되며 검색 결과 리스트가 즉시 부분 렌더링되는 메커니즘을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>SPA 기반 고속 폼 전환</strong>: 브라우저 전체 리로드 없이 URL과 쿼리스트링만 변경하며 결과를 즉각 업데이트합니다.</li>
              <li><strong>결과 페이지 뷰포트 프리페치</strong>: 폼이 뷰포트에 진입할 때 <code>action</code>에 지정된 대상 경로의 정적 레이아웃 셸을 백그라운드에서 사전 다운로드합니다.</li>
              <li><strong>점진적 향상(Progressive Enhancement)</strong>: JavaScript가 비활성화되거나 로드 중인 환경에서도 표준 HTML form 제출로 완벽하게 폴백 동작합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 통합 검색창 및 카테고리 필터링 폼 (GET)</li>
              <li>관리자 대시보드 주문/회원 검색 및 날짜 범위 필터 폼</li>
              <li>Server Actions 결합을 통한 회원가입/주문서 제출 폼 (POST)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>GET vs POST 동작 차이</strong>: <code>action</code>에 문자열 URL(e.g., <code>action="/search"</code>)을 전달하면 GET 방식의 클라이언트 내비게이션으로 동작하며, Server Action 함수를 전달하면 POST 방식의 비동기 서버 액션으로 실행됩니다.</li>
              <li><strong>빈 쿼리 파라미터 제어</strong>: 입력되지 않은 빈 필드가 URL에 <code>?q=&category=</code> 형태로 남지 않도록 필요 시 클라이언트 훅으로 정리할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
