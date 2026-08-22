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

  const defaultExpected = "• headers() 전역 보안 응답 헤더 일괄 주입 (CSP, HSTS) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="headers() 전역 보안 응답 헤더 일괄 주입 (CSP, HSTS) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="headers() 전역 보안 응답 헤더 일괄 주입 (CSP, HSTS)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>next.config.ts의 headers() 설정 함수는 모든 라우트 또는 특정 경로 매칭 패턴에 Content-Security-Policy(CSP), HSTS, X-Frame-Options 등 엔터프라이즈 보안 HTTP 헤더를 일괄 주입하는 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>source: &apos;/:path*&apos; 매칭을 통해 브라우저 클릭재킹을 방지하는 X-Frame-Options: DENY, XSS 스크립트 실행을 원천 차단하는 CSP 규칙, HTTPS 강제 적용 HSTS 헤더를 응답에 자동 부여합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>코드 변경 없는 중앙 집중식 보안 강화: 개별 페이지나 API 라우트마다 헤더를 작성할 필요 없이 전역 설정 파일에서 보안 정책을 일원화 관리합니다.</li>
              <li>웹 취약점 원천 방어: 금융/이커머스 서비스의 필수 보안 인증(ISMS-P, PCI-DSS) 요건을 프레임워크 레벨에서 충족합니다.</li>
              <li>CDN 및 브라우저 캐싱 보안: 보안 헤더가 CDN 엣지 레벨까지 전파되어 악의적인 중간자 공격(MITM)을 방어합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 결제 및 개인정보 처리 페이지 보안 규정(CSP, Strict-Transport-Security) 준수</li>
              <li>외부 악성 사이트의 iframe 삽입을 통한 클릭재킹 공격 차단</li>
              <li>MIME 스니핑 방지(X-Content-Type-Options: nosniff) 및 Referrer 유출 통제</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
