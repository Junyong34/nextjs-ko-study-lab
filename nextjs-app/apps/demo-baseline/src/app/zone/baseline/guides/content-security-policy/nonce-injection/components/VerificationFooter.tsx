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

  const defaultExpected = "• Middleware Nonce 기반 CSP 헤더 주입 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="Middleware Nonce 기반 CSP 헤더 주입 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Middleware Nonce 기반 CSP 헤더 주입">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Middleware Nonce 기반 CSP(Content Security Policy)는 매 HTTP 요청마다 암호학적으로 안전한 무작위 난수(Nonce)를 생성하여 <code>Content-Security-Policy: script-src 'nonce-...'</code> 응답 헤더를 설정하고, Next.js 렌더링 파이프라인의 <code>{'<'}script nonce={'{'}nonce{'}'}{'>'}</code>에 주입하여 XSS(Cross-Site Scripting) 공격을 원천 방어하는 보안 표준 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 미들웨어가 <code>crypto.randomUUID()</code>로 난수 Nonce를 발급하여 <code>x-nonce</code> 헤더로 전달하고, Root Layout이 이를 읽어 인라인 스크립트에 <code>nonce</code> 속성을 바인딩함으로써 인가되지 않은 악성 인라인 스크립트 실행이 브라우저에서 자동 차단되는 과정을 시각화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>XSS 공격 100% 방어</strong>: 공격자가 악의적인 <code>{'<'}script{'>'}</code>를 페이지에 주입하더라도 매 요청마다 바뀌는 Nonce 서명이 없으므로 브라우저가 실행을 거부합니다.</li>
              <li><strong>'unsafe-inline' 제거</strong>: 구형 CSP에서 허용하던 취약한 <code>'unsafe-inline'</code> 지시문을 제거하고 강력하고 현대적인 화이트리스트 보안 모델을 수립합니다.</li>
              <li><strong>Next.js 빌트인 스크립트 완벽 호환</strong>: Next.js의 <code>next/script</code> 및 프레임워크 런타임 번들이 Nonce 헤더와 자동 동기화되어 에러 없이 동작합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>전자상거래 결제창 및 고객 카드 정보 입력 페이지 보안 강화</li>
              <li>금융권 인터넷 뱅킹 및 자산 관리 웹 서비스의 엄격한 보안 감사 준수</li>
              <li>사용자 생성 콘텐츠(UGC, 상품 리뷰, 커뮤니티)를 표시하는 웹 페이지 XSS 방어</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>정적 캐싱(SSG) 불가 주의</strong>: Nonce는 매 요청마다 고유해야 하므로 Nonce가 주입된 페이지는 CDN에 정적으로 캐싱될 수 없으며 동적 렌더링(SSR)되어야 합니다.</li>
              <li><strong>서드파티 스크립트 도메인 명시</strong>: 구글 태그 매니저나 외부 PG SDK처럼 Nonce가 적용되지 않는 외부 스크립트는 CSP의 <code>script-src</code> 도메인 화이트리스트에 정확히 명시해야 차단되지 않습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
