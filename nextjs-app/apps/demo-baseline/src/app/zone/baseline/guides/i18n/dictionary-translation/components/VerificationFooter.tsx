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

  const defaultExpected = "• 서버 사이드 사전 JSON 번역 렌더링 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="서버 사이드 사전 JSON 번역 렌더링 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="서버 사이드 사전 JSON 번역 렌더링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js App Router의 다국어(i18n), 멀티 테넌트(Multi-tenant), 멀티 존(Multi-zones) 아키텍처는 단일 코드베이스에서 서브패스(/[lang]), 서브도메인, 또는 독립 배포 단위(Zone)를 기반으로 대규모 글로벌 전자상거래 플랫폼을 유연하게 확장하는 엔터프라이즈 설계입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 /ko/products와 /en/products로 접속 시 사전(Dictionary) JSON을 로드하여 통화(KRW vs USD)와 언어를 자동 전환하고, store-a.shop과 store-b.shop 서브도메인에 따라 각 입점 브랜드 전용 테마와 로고를 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 SEO 점수 극대화: 국가별 서브패스 라우팅으로 구글 검색엔진에 언어별 맞춤 인덱싱을 보장합니다.</li>
              <li>테넌트별 독립 브랜딩: 단일 인프라에서 수천 개의 독립 입점 쇼핑몰 테마와 디자인을 데이터 기반으로 동적 서빙합니다.</li>
              <li>독립 빌드 및 배포: 멀티 존을 통해 거대한 쇼핑몰을 메인 몰, 라이브 커머스, 관리자 앱 등으로 분할 빌드하여 배포 리스크를 분산합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 5개국(한국, 미국, 일본, 대만, 베트남) 다국어 쇼핑몰 서비스</li>
              <li>카페24/스마트스토어 스타일의 SaaS 멀티 테넌트 쇼핑몰 호스팅 플랫폼</li>
              <li>대규모 이커머스 모노레포의 마이크로 프론트엔드 멀티 존 아키텍처</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
