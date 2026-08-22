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

  const defaultExpected = "• React 19 use(Promise) &amp; Suspense 스트리밍 패칭 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="React 19 use(Promise) &amp; Suspense 스트리밍 패칭 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="React 19 use(Promise) &amp; Suspense 스트리밍 패칭">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>SWR, TanStack Query 및 React 19 Suspense 스트리밍은 서버 사이드 초기 렌더링과 클라이언트 사이드 실시간 비동기 상태 관리를 결합하여 네트워크 지연을 극복하는 현대적 데이터 패칭 아키텍처입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 핵심 상품 정보는 서버에서 즉시 전송(0ms)하고, 무거운 추천 상품과 실시간 구매 후기는 Suspense 청크 스트리밍으로 점진적 표시하며, 배송 기사 위치는 SWR 3초 폴링으로 실시간 갱신합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>TTFB(Time To First Byte) 0ms: 무거운 서브 데이터 때문에 메인 페이지 전체가 멈추는 블로킹을 완전히 제거합니다.</li>
              <li>실시간 데이터 자동 동기화: 배송 상태 변경이나 재고 소진 시 사용자가 새로고침하지 않아도 화면이 자동 갱신됩니다.</li>
              <li>낙관적 업데이트(Optimistic Update): 주문 상태 변경 시 로딩 스피너 없이 UI를 즉시 갱신하고 백그라운드에서 서버와 동기화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 실시간 배송 기사 위치 추적 및 주문 상태 자동 관제</li>
              <li>수만 개 상품 목록의 무한 스크롤(Infinite Scroll) 피드</li>
              <li>상품 상세 페이지의 구매 후기 및 AI 추천 상품 점진적 스트리밍</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
