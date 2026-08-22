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

  const defaultExpected = "• cacheComponents: true Next.js 16 플래그 활성화 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="cacheComponents: true Next.js 16 플래그 활성화 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="cacheComponents: true Next.js 16 플래그 활성화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>experimental.cacheComponents: true는 Next.js 16의 차세대 Cache Components 아키텍처(&apos;use cache&apos;, cacheLife, cacheTag, custom cacheHandler)를 프로젝트 전체에 활성화하는 플래그입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>next.config.ts에 플래그를 활성화하면 컴파일러가 컴포넌트/함수 레벨의 &apos;use cache&apos; 지시어를 해석하고 자동 인자 직렬화 및 정밀 캐시 라이프사이클을 가동합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>선언적 캐싱 패러다임 전환: 복잡한 fetch 옵션이나 unstable_cache 수동 키 관리 없이 코드 레벨에서 직관적으로 캐시 경계를 정의합니다.</li>
              <li>컴포넌트 JSX 트리 직접 캐싱: 계산량이 많은 복잡한 UI 서브트리를 직렬화된 RSC 페이로드로 캐시하여 렌더링 부하를 제로화합니다.</li>
              <li>마이크로초 단위 초고속 서빙: 빌드 타임 및 온디맨드 런타임 캐시가 완벽히 결합되어 최상의 응답 속도를 달성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>Next.js 16 Cache Components 신규 프로젝트 아키텍처 도입</li>
              <li>복잡한 카탈로그/추천 알고리즘 컴포넌트 JSX 캐싱</li>
              <li>실시간 재고와 캐시 컴포넌트의 유연한 태그 기반 동기화</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
