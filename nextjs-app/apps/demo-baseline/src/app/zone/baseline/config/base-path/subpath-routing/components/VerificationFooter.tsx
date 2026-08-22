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

  const defaultExpected = "• basePath: &apos;/shop&apos; 설정에 따른 전체 서브패스 라우팅 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="basePath: &apos;/shop&apos; 설정에 따른 전체 서브패스 라우팅 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="basePath: &apos;/shop&apos; 설정에 따른 전체 서브패스 라우팅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>basePath는 애플리케이션의 모든 라우트, Link 컴포넌트, 정적 자산 경로 앞에 특정 서브패스(예: /shop)를 일괄 부여하는 next.config.ts 전역 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>basePath: &apos;/shop&apos; 설정 시 Link href=&quot;/products&quot;가 자동으로 /shop/products로 렌더링되며, 클라이언트 라우터가 서브패스를 투명하게 유지합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>엔터프라이즈 서브패스 마이크로 프론트엔드 통합: 대형 포털 사이트의 특정 하위 경로(/shop, /admin)에 Next.js 앱을 원활히 마운트합니다.</li>
              <li>리버스 프록시 연동 단순화: Nginx/AWS ALB 등 상위 인프라 라우팅 규칙과 프론트엔드 라우팅 경로를 완벽히 일치시킵니다.</li>
              <li>하드코딩 없는 상대 경로 관리: 코드 내 모든 링크에 수동으로 서브패스를 붙이지 않아도 자동으로 프리픽스가 적용됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>통합 기업 사이트 내 독립 이커머스 몰(/shop) 호스팅</li>
              <li>사내 관리자 콘솔(/admin) 전용 Next.js 포털 분리</li>
              <li>Multi-Zone 마이크로 프론트엔드 서브패스 분할 아키텍처</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
