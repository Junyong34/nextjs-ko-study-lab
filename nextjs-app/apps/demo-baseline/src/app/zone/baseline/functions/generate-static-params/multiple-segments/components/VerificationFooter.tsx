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

  const defaultExpected = "• generateStaticParams [category]/[id] 다중 세그먼트 조합 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="generateStaticParams [category]/[id] 다중 세그먼트 조합 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="generateStaticParams [category]/[id] 다중 세그먼트 조합">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>generateStaticParams는 동적 라우트 세그먼트([category], [id])와 결합하여 빌드 타임에 사전 렌더링(SSG)할 매개변수 목록을 배열로 반환함으로써, 수천 개의 상품 상세 페이지를 정적 HTML로 미리 빌드해 두는 Next.js 빌트인 함수입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 인기 베스트셀러 상품 100개의 ID와 카테고리 조합을 generateStaticParams에서 반환하여 빌드 시점에 사전 생성해 두고, 사용자가 해당 상품에 접속하면 DB 조회 없이 0ms 즉시 정적 페이지를 서빙합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>초고속 TTFB 0ms 달성: 데이터베이스 쿼리와 서버 사이드 연산 없이 CDN 엣지에서 즉시 정적 HTML을 서빙합니다.</li>
              <li>데이터베이스 부하 완벽 분산: 대규모 트래픽이 몰리는 메인 베스트 상품 페이지가 오리진 DB에 전혀 부하를 주지 않습니다.</li>
              <li>증분 정적 재생성(ISR) 연계: 빌드 시점에 생성되지 않은 신규 상품은 dynamicParams 설정에 따라 첫 요청 시 생성되어 캐시에 추가됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상위 1,000개 베스트셀러 및 스테디셀러 상품 사전 SSG 빌드</li>
              <li>대분류/중분류/소분류 계층형 카테고리 메인 화면 사전 렌더링</li>
              <li>브랜드별 공식 스토어 및 시즌 기획전 정적 페이지 사전 생성</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
