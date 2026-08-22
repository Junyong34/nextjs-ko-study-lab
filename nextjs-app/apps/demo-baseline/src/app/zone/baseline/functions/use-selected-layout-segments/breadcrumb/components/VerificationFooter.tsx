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

  const defaultExpected = "• useSelectedLayoutSegments() 계층형 브레드크럼 생성 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="useSelectedLayoutSegments() 계층형 브레드크럼 생성 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="useSelectedLayoutSegments() 계층형 브레드크럼 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>useSelectedLayoutSegment() 및 useSelectedLayoutSegments()는 부모 레이아웃 기준에서 현재 활성화된 바로 아래 하위 세그먼트 문자열 또는 전체 하위 세그먼트 배열을 읽어와 탭 네비게이션 및 브레드크럼(Breadcrumb)을 생성하는 전용 훅입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 카테고리 계층 구조(/shop/electronics/keyboards/prod-001)에서 useSelectedLayoutSegments()를 호출하여 &apos;홈 &gt; 전자기기 &gt; 키보드 &gt; 프로 무선 키보드&apos; 브레드크럼 네비게이션을 자동으로 생성합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>자동화된 계층형 브레드크럼: URL 깊이가 달라져도 수동 설정 없이 파일 시스템 세그먼트 기반으로 정확한 네비게이션 경로를 렌더링합니다.</li>
              <li>레이아웃 레벨 탭 바인딩: 하위 페이지가 변경되어도 부모 레이아웃이 활성 탭 인디케이터를 정확하게 표시합니다.</li>
              <li>병렬 라우트 슬롯 지원: parallel routes 슬롯 내부의 하위 세그먼트도 개별 감지할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 대분류 &gt; 중분류 &gt; 소분류 &gt; 상품 상세 계층형 브레드크럼 경로 표시</li>
              <li>관리자 센터 복합 탭 네비게이션(매출 &gt; 일별 통계 &gt; 결제 수단별 분석)</li>
              <li>마이페이지 계층 네비게이션 인디케이터</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
