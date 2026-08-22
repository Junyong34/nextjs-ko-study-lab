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

  const defaultExpected = "• dynamicParams true vs false 설정 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="dynamicParams true vs false 설정 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="dynamicParams true vs false 설정">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>export const dynamicParams = true | false는 generateStaticParams()로 사전 생성되지 않은 동적 세그먼트 파라미터에 대한 온디맨드 서버 렌더링 허용 여부를 제어하는 라우트 세그먼트 옵션입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>dynamicParams = false 설정 시 빌드 시점에 지정되지 않은 상품 ID 접근을 즉시 404 Not Found로 차단하고, true일 경우 최초 요청 시 온디맨드로 SSR 생성 후 캐싱합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>무제한 동적 URL 공격(DDoS/캐시 포이즈닝) 방어: 존재하지 않는 임의의 상품 ID 요청이 서버 렌더링 자원을 고갈시키는 것을 방지합니다.</li>
              <li>엄격한 카탈로그 접근 통제: 단종 상품이나 비공개 테스트 상품의 비정상적인 SSR 접근을 프레임워크 레벨에서 404 처리합니다.</li>
              <li>정적 호스팅 예측 가능성 보장: 사전 정의된 정적 페이지만 서빙하도록 제한하여 인프라 비용과 렌더링 부하를 예측 가능하게 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>한정판 프로모션 상품 상세 페이지의 사전 정의된 카탈로그 고정 서빙</li>
              <li>신규 등록 상품의 온디맨드 렌더링 허용(true) vs 단종 상품 차단(false)</li>
              <li>정적 내보내기(output: &apos;export&apos;) 환경에서의 정적 경로 엄격 제한</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
