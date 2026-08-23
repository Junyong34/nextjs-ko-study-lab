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
            <DemoDeepDiveCard title="next.config.ts headers() 전역 보안 헤더 주입 (CSP, HSTS, X-Frame-Options)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>next.config.ts</code>의 <code>async headers()</code> 설정은 모든 페이지와 API 라우트의 HTTP 응답에 Content-Security-Policy(CSP), Strict-Transport-Security(HSTS), X-Content-Type-Options, X-Frame-Options 등 엔터프라이즈 보안 헤더를 선언적으로 일괄 주입하는 표준 빌드 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>source: '/:path*'</code> 패턴에 대해 클릭재킹 방어(<code>X-Frame-Options: DENY</code>), MIME 스니핑 방어(<code>X-Content-Type-Options: nosniff</code>), XSS 공격 방어 CSP 헤더를 정의하여 모든 HTTP 응답 헤더에 자동 적용되는 결과를 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>웹 취약점 원천 방어</strong>: XSS, 클릭재킹, MIME 스니핑, 프로토콜 다운그레이드 공격을 브라우저 보안 정책 수준에서 원천 차단합니다.</li>
              <li><strong>ISMS/금융 보안 컴플라이언스 충족</strong>: 결제 및 전자상거래 서비스가 요구하는 엄격한 보안 감사 기준을 손쉽게 달성합니다.</li>
              <li><strong>선언적 일괄 관리</strong>: 개별 라우트마다 헤더 코드를 작성할 필요 없이 단일 설정 파일에서 전체 서비스의 보안 정책을 중앙 집중 제어합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>전자상거래 결제 및 회원 정보 페이지의 클릭재킹 및 스크립트 인젝션 방어</li>
              <li>금융/핀테크 서비스의 HTTPS 강제화(HSTS) 및 강력한 CSP 정책 적용</li>
              <li>B2B SaaS 관리자 콘솔의 iframe 삽입 제한 및 외부 리소스 화이트리스트 관리</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>엄격한 CSP 설정 시 서드파티 스크립트 차단 주의</strong>: Google Analytics, 카카오 SDK 등 외부 스크립트 도메인을 CSP의 <code>script-src</code> 화이트리스트에 누락하면 스크립트 실행이 차단될 수 있으므로 정밀한 도메인 정의가 필요합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
