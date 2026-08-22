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

  const defaultExpected = "• logging.fetches.fullUrl: true 서버 fetch 콘솔 상세 로깅 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="logging.fetches.fullUrl: true 서버 fetch 콘솔 상세 로깅 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="logging.fetches.fullUrl: true 서버 fetch 콘솔 상세 로깅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>logging.fetches는 Next.js 개발 모드에서 서버 컴포넌트의 fetch() 호출에 대해 전체 URL, HTTP 상태 코드, 캐시 상태(HIT, MISS, SKIP)를 서버 터미널에 상세 출력하는 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>logging: &#123; fetches: &#123; fullUrl: true &#125; &#125; 설정 시 백엔드 API 요청의 실제 쿼리스트링 및 캐시 적중 여부가 터미널에 실시간 기록되어 데이터 흐름을 직관적으로 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>투명한 서버 데이터 캐시 관찰: 백엔드 API 호출 시 캐시 히트/미스 상태를 즉각 확인하여 중복 네트워크 호출을 적발합니다.</li>
              <li>API 디버깅 시간 단축: 요청 URL과 쿼리 파라미터가 온전히 표시되어 백엔드 엔드포인트 오타나 토큰 누락을 빠르게 진단합니다.</li>
              <li>Data Cache 수명 주기 분석: revalidate 주기에 따른 캐시 갱신 타이밍을 시각적으로 파악합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 목록 및 카테고리 fetch() 캐시 히트율 모니터링</li>
              <li>백엔드 마이크로서비스 API 호출 쿼리스트링 디버깅</li>
              <li>Next.js 16 캐시 무효화(revalidateTag) 동작 검증</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
