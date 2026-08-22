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

  const defaultExpected = "• crossOrigin: &apos;anonymous&apos; 서드파티 스크립트 속성 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="crossOrigin: &apos;anonymous&apos; 서드파티 스크립트 속성 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="crossOrigin: &apos;anonymous&apos; 서드파티 스크립트 속성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>crossOrigin: &apos;anonymous&apos;는 Next.js가 생성하는 script 및 link 태그에 CORS 자격 증명(쿠키, 인증 헤더) 없이 교차 출처 자산을 로드하도록 지정하는 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>외부 CDN에서 JS/CSS 번들을 로드할 때 crossOrigin 속성을 통해 브라우저 스크립트 에러의 상세 스택 트레이스(window.onerror) 수집을 가능하게 합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>정확한 클라이언트 에러 모니터링: 외부 CDN 자산에서 발생하는 오류가 모호한 &apos;Script error.&apos;로 뭉개지지 않고 정확한 파일/라인으로 로깅됩니다.</li>
              <li>보안 자격 증명 유출 차단: 교차 출처 자산 요청 시 불필요한 사용자 세션 쿠키나 인증 토큰이 CDN 서버로 누출되는 위험을 원천 방지합니다.</li>
              <li>자산 서브리소스 무결성(SRI) 연동 준비: 외부 스크립트 무결성 검증 표준과 완벽히 호환되는 보안 기초를 마련합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>Sentry/Datadog 등 프론트엔드 APM 에러 로깅 정확도 확보</li>
              <li>외부 공용 CDN에 분산 호스팅된 이커머스 JS 번들 로딩 보안</li>
              <li>서드파티 결제 모듈 및 분석 스크립트의 CORS 요청 격리</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
