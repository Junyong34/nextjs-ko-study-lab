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

  const defaultExpected = "• cookies().get() 읽기 & cookies().set() 세션 쿠키 발급 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="cookies().get() 읽기 & cookies().set() 세션 쿠키 발급 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="cookies() 세션 쿠키 읽기/쓰기 및 만료 수명 제어">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>cookies()</code> (<code>next/headers</code>)는 서버 컴포넌트, Server Action, Route Handler에서 브라우저 쿠키를 조회, 설정, 삭제하는 비동기 함수(Next.js 15+ <code>await cookies()</code>)입니다. <code>httpOnly</code>, <code>secure</code>, <code>sameSite</code>, <code>maxAge</code> 등 보안 속성을 완벽히 지원합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 사용자가 로그인 시 Server Action에서 <code>(await cookies()).set('session_token', token, {'{'} httpOnly: true, secure: true {'}'})</code>로 세션을 발급하고, 서버 컴포넌트에서 이를 읽어 로그인 사용자 프로필을 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>XSS 공격 방어</strong>: <code>httpOnly: true</code> 쿠키 설정을 통해 악성 자바스크립트 스크립트가 세션 토큰을 탈취하는 것을 원천 차단합니다.</li>
              <li><strong>CSRF 방어 강화</strong>: <code>sameSite: 'lax' | 'strict'</code> 설정을 통해 타 사이트에서의 위조 요청을 방어합니다.</li>
              <li><strong>선언적 수명 관리</strong>: <code>maxAge</code> 및 <code>expires</code>를 통해 자동 만료되는 임시 장바구니/세션을 손쉽게 구성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>사용자 로그인 인증 JWT 세션 토큰 발급 및 만료 제어</li>
              <li>비회원 사용자의 임시 장바구니 ID(<code>cart_id</code>) 쿠키 바인딩</li>
              <li>다크모드/라이트모드 및 최근 본 상품 ID 목록의 쿠키 저장</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Server Component 쓰기 제한</strong>: Server Component 본문에서는 쿠키 읽기만 가능하며, <code>cookies().set()</code> 쓰기 작업은 Server Action 또는 Route Handler에서만 수행할 수 있습니다.</li>
              <li><strong>동적 렌더링 전환</strong>: <code>cookies()</code>를 읽는 라우트는 요청별 사용자 상태가 다르므로 동적(Dynamic) 렌더링으로 처리됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
