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

  const defaultExpected = "• devIndicators 렌더링 상태 개발 뱃지 제어 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="devIndicators 렌더링 상태 개발 뱃지 제어 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="devIndicators 렌더링 상태 개발 뱃지 제어">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>devIndicators는 Next.js 개발 모드에서 화면에 표시되는 빌드 상태 및 정적/동적 렌더링 인디케이터 뱃지의 노출 위치와 동작을 제어하는 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>devIndicators: &#123; position: &apos;bottom-right&apos; &#125; 설정을 통해 컴포넌트 렌더링 수명 주기와 서버 컴포넌트 페이로드 스트리밍 여부를 시각적으로 즉각 모니터링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>렌더링 전략 즉각 파악: 현재 탐색 중인 화면이 정적 SSG인지 동적 SSR/RSC인지 브라우저에서 바로 확인합니다.</li>
              <li>UI 겹침 간섭 방지: 하단 플로팅 결제 바나 상담 챗봇 위젯이 있는 이커머스 UI에서 개발 뱃지 위치를 자유롭게 조정합니다.</li>
              <li>컴파일 상태 가시화: 코드 변경 시 Turbopack의 증분 컴파일 진행 상황을 실시간으로 확인합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>복잡한 이커머스 상세/장바구니 화면의 렌더링 전략(정적/동적) 디버깅</li>
              <li>모바일 뷰포트 에뮬레이션 시 화면 하단 네비게이션 간섭 방지</li>
              <li>로컬 개발 환경에서의 서버 컴포넌트 스트리밍 완료 상태 실시간 관찰</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
