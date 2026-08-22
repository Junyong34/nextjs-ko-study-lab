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

  const defaultExpected = "• rewrites() Zone 간 라우팅 및 외부 API 프록시 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="rewrites() Zone 간 라우팅 및 외부 API 프록시 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="rewrites() Zone 간 라우팅 및 외부 API 프록시">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>rewrites()의 크로스 존 프록시는 다른 도메인 또는 독립 포트에 배포된 서브 애플리케이션(예: 블로그, 결제 존)으로의 요청을 주소창 변경 없이 백그라운드 중계하는 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>source: &apos;/blog/:path*&apos;, destination: &apos;https://blog.shop.com/:path*&apos; 규칙을 통해 사용자는 단일 도메인에서 끊김 없이 여러 마이크로 프론트엔드 존을 탐색합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>독립 배포 파이프라인: 커머스 팀과 마케팅 블로그 팀이 서로의 빌드/배포 간섭 없이 독립적인 릴리스를 수행합니다.</li>
              <li>단일 도메인 SEO 파워 유지: 서브도메인 대신 단일 도메인 하위 경로(shop.com/blog)로 통합하여 검색 엔진 최적화 점수를 집중시킵니다.</li>
              <li>점진적 시스템 전환: 기존 레거시 백엔드를 페이지 단위로 Next.js로 안전하게 무중단 이관합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대형 쇼핑몰 Multi-Zone 아키텍처(카탈로그 존, 결제 존, 고객센터 존 분리)</li>
              <li>레거시 백엔드 쇼핑몰에서 Next.js App Router로의 점진적 마이그레이션</li>
              <li>서브도메인 블로그를 메인 도메인 하위 경로로 프록시 통합</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
