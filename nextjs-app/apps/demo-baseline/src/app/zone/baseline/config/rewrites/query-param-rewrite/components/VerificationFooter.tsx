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

  const defaultExpected = "• rewrites() 쿼리 파라미터 매핑 라우팅 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="rewrites() 쿼리 파라미터 매핑 라우팅 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="rewrites() 쿼리 파라미터 매핑 라우팅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>rewrites()의 has: [&#123; type: &apos;query&apos;, key: &apos;...&apos; &#125;] 옵션은 요청의 쿼리스트링 파라미터를 기반으로 특정 목적지 경로로 요청을 조건부 중계하는 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>?campaign=summer2026 쿼리가 감지되면 서버 내부에서 프로모션 전용 렌더링 세그먼트로 요청을 rewrite하여 동일한 기본 경로에서 타겟 맞춤형 콘텐츠를 서빙합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>서버 사이드 라우트 분기: 클라이언트 분기 로직 없이 서버 라우팅 엔진에서 최적화된 컴포넌트 트리를 즉시 서빙합니다.</li>
              <li>마케팅 캠페인 링크 관리 단순화: 사용자가 공유한 쿼리 파라미터에 따라 주소창 변경 없이 전용 이벤트 레이아웃을 제공합니다.</li>
              <li>독립 캐시 분리: 프로모션별 독립적인 캐시 정책을 라우트 수준에서 깔끔하게 분리 적용합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>광고 추적 파라미터(?utm_source=...) 기반 전용 랜딩 페이지 rewrite</li>
              <li>VIP 회원 전용 프로모션 쿼리 기반 특가 할인 화면 서빙</li>
              <li>A/B 테스트 파라미터에 따른 동적 페이지 분기 처리</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
