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

  const defaultExpected = "• poweredByHeader: false 서버 정보 은닉 보안 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="poweredByHeader: false 서버 정보 은닉 보안 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="next.config.ts poweredByHeader 제거를 통한 서버 정보 은닉 & 보안 강화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>poweredByHeader: false</code> (<code>next.config.ts</code>) 설정은 Next.js가 기본적으로 모든 HTTP 응답 헤더에 포함하는 <code>X-Powered-By: Next.js</code> 헤더를 제거하는 보안 강화 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>poweredByHeader: false</code> 적용 전후의 HTTP 응답 헤더를 비교하여, 외부 공격자에게 서버가 Next.js 프레임워크 기반으로 구동되고 있다는 정보를 노출하지 않도록 차단하는 보안 검증을 수행합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 지문(Server Fingerprinting) 은닉</strong>: 공격자가 특정 프레임워크의 알려진 보안 취약점(CVE)을 타겟팅하여 공격하는 것을 사전에 방지합니다.</li>
              <li><strong>정보 유출 최소화</strong>: 전자금융감독규정 및 정보보호관리체계(ISMS)의 '시스템 정보 노출 방지' 요구사항을 충족합니다.</li>
              <li><strong>응답 페이로드 미세 절감</strong>: 불필요한 헤더 바이트를 제거하여 네트워크 전송 효율을 미세하게 개선합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>엔터프라이즈 전자상거래 및 금융 서비스의 보안 취약점 조치</li>
              <li>ISMS-P 및 공공기관 웹 보안성 심의 대응</li>
              <li>프레임워크 버전을 숨겨야 하는 엔터프라이즈 B2B 웹 애플리케이션</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>단독 조치로 충분치 않음</strong>: <code>poweredByHeader: false</code> 외에도 Server 헤더 제거, CSP 설정 등 다계층 심층 방어(Defense in Depth) 보안 전략을 함께 적용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
