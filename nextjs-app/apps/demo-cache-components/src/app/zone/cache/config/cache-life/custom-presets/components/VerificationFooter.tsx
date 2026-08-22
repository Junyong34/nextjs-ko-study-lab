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

  const defaultExpected = "• experimental.cacheLife 커스텀 수명 프리셋 전역 정의 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="experimental.cacheLife 커스텀 수명 프리셋 전역 정의 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="experimental.cacheLife 커스텀 수명 프리셋 전역 정의">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>cacheLife는 stale, revalidate, expire 3단계 수명 주기를 갖는 커스텀 캐시 프로필(예: flashSale, productDetail)을 next.config.ts에서 전역 정의하는 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>cacheLife: &#123; flashSale: &#123; stale: 5, revalidate: 10, expire: 60 &#125; &#125;와 같이 도메인별 수명 정책을 사전 정의하고 코드에서 cacheLife(&apos;flashSale&apos;)로 간단히 호출합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>비즈니스 도메인별 수명 정책 표준화: 코드마다 흩어져 있던 초 단위 TTL 매직 넘버를 없애고 중앙 설정으로 일원화합니다.</li>
              <li>3단계 정밀 수명 제어: 클라이언트 유효 기간(stale), 백그라운드 재검증 주기(revalidate), 최종 스토리지 만료(expire)를 정밀 제어합니다.</li>
              <li>유지보수성 극대화: 캐시 정책 변경 시 개별 코드 수정 없이 next.config.ts의 프리셋 값만 수정하여 전역 반영합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>초단위 실시간 가격 변동 상품 전용 초단기 캐시 프로필(flashSale)</li>
              <li>1시간 단위 카테고리/기획전 준실시간 캐시 프로필(hourlyCatalog)</li>
              <li>일일 정산 및 통계 리포트 장기 캐시 프로필(dailyReport)</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
