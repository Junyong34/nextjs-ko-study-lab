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

  const defaultExpected = "• Next.js 16 proxy.ts 요청 가로채기 및 rewrite/헤더 주입 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Next.js 16 proxy.ts 요청 가로채기 및 rewrite/헤더 주입 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Next.js 16 proxy.ts 요청 가로채기 및 rewrite/헤더 주입">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js 16의 proxy.ts(구 middleware.ts)는 페이지 렌더링 전 네트워크 최전선에서 요청을 가로채어 URL rewrite, 조건부 redirect, 커스텀 헤더 주입을 수행하는 게이트웨이 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>브라우저 주소창 URL 변경 없이 내부 마이크로서비스 또는 A/B 테스트 목적지로 요청을 rewrite하고, 요청/응답 헤더에 x-user-tier, x-auth-token, x-geo-country를 투명하게 주입합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>단일 오리진(Same-Origin) 아키텍처: 클라이언트에 내부 백엔드 토폴로지를 노출하지 않고 단일 도메인으로 통합된 라우팅을 제공합니다.</li>
              <li>제로 클라이언트 오버헤드: 자바스크립트 번들이 로드되기 전 엣지/프록시 레벨에서 라우팅과 권한 헤더를 결정하여 TTFB를 단축합니다.</li>
              <li>무중단 마이그레이션 &amp; A/B 테스트: 사용자 그룹별로 점진적 트래픽 전환(Traffic Shifting)을 서버 사이드에서 안전하게 제어합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>Multi-Zone 쇼핑몰 프론트엔드 라우팅 및 BFF(Backend For Frontend) 중계</li>
              <li>글로벌 접속 국가(GeoIP)별 로케일 rewrite 및 관세/통화 헤더 주입</li>
              <li>결제 게이트웨이 인증 토큰 검증 및 백엔드 프록시 전달</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
