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

  const defaultExpected = "• Proxy Nonce 기반 CSP 헤더 주입의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Proxy Nonce 기반 CSP 헤더 주입 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="Proxy Nonce 기반 CSP 헤더 주입">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Proxy Nonce 기반 CSP(Content Security Policy)는 매 HTTP 요청마다 난수(Nonce)를 생성해 <code>Content-Security-Policy: script-src 'nonce-...'</code> 응답 헤더와 <code>{'<'}script nonce={'{'}nonce{'}'}{'>'}</code> 속성에 사용합니다. 브라우저는 헤더의 Nonce와 일치하지 않는 인라인 스크립트를 실행하지 않습니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>이 예제에서는 <code>proxy.ts</code>가 <code>crypto.randomUUID()</code>로 Nonce를 만들고 <code>x-nonce</code> 헤더로 전달합니다. Root Layout은 이 값을 읽어 인라인 스크립트의 <code>nonce</code> 속성에 넣고, 브라우저가 Nonce가 없는 스크립트를 차단하는 결과를 보여 줍니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Nonce 없는 스크립트 실행 차단</strong>: 공격자가 악의적인 <code>{'<'}script{'>'}</code>를 페이지에 주입하더라도 매 요청마다 바뀌는 Nonce가 없으면 브라우저가 실행하지 않습니다.</li>
              <li><strong>'unsafe-inline' 제거</strong>: 구형 CSP에서 허용하던 취약한 <code>'unsafe-inline'</code> 지시문을 제거하고 강력하고 현대적인 화이트리스트 보안 모델을 수립합니다.</li>
              <li><strong>Next.js 스크립트 호환 확인</strong>: Next.js의 <code>next/script</code>와 프레임워크 런타임 번들에 Nonce를 적용할 때 동작을 함께 확인할 수 있습니다.</li>
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
              <li><strong>정적 캐싱(SSG) 주의</strong>: Nonce는 요청마다 달라지므로 Nonce를 주입하는 페이지의 캐시 전략과 다이나믹 렌더링 여부를 함께 검토해야 합니다.</li>
              <li><strong>서드파티 스크립트 도메인 명시</strong>: 구글 태그 매니저나 외부 PG SDK처럼 Nonce가 적용되지 않는 외부 스크립트는 CSP의 <code>script-src</code> 도메인 화이트리스트에 정확히 명시해야 차단되지 않습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
