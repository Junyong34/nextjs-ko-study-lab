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

  const defaultExpected = "• headers().get('authorization') 커스텀 인증 토큰 검증의 동작과 기대 결과를 확인합니다."
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
        title="headers().get('authorization') 커스텀 인증 토큰 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="headers() 커스텀 인증 토큰(Bearer) 파싱 및 권한 검증">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>headers()</code> (<code>next/headers</code>)는 Server Component, Server Action, Route Handler에서 들어오는 HTTP 요청 헤더를 읽을 수 있는 비동기 함수(Next.js 15+ <code>await headers()</code>)입니다. <code>Authorization</code> 헤더의 Bearer 토큰 및 프록시 전달 헤더를 안전하게 추출합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 클라이언트 요청에 포함된 Bearer 토큰을 서버에서 <code>(await headers()).get('authorization')</code>으로 추출하여 토큰 유효성을 검증하고, 인증된 사용자 등급(VIP, 일반)에 따른 맞춤 할인 혜택을 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>보안 토큰 서버 검증</strong>: 클라이언트 사이드 변조 없이 서버사이드에서 직접 토큰을 검증하여 민감한 리소스 접근을 보호합니다.</li>
              <li><strong>마이크로서비스 인증 전파</strong>: 수신된 인증 헤더를 백엔드 내부 BFF 및 마이크로서비스 호출 시 손쉽게 전달(Forwarding)합니다.</li>
              <li><strong>읽기 전용 안정성</strong>: <code>headers()</code>는 읽기 전용이므로 실수로 요청 헤더를 오염시키는 부수 효과를 방지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>B2B API 게이트웨이의 API 키 및 Bearer JWT 인증 검증</li>
              <li>마이크로서비스 간 트랜잭션 추적을 위한 <code>x-correlation-id</code> / <code>traceparent</code> 추출</li>
              <li>프록시/로드밸런서가 전달한 클라이언트 원본 IP(<code>x-real-ip</code>) 감사 로깅</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>헤더 변경 불가</strong>: <code>headers()</code>는 요청 헤더를 읽는 용도이며, 응답 헤더를 설정하려면 <code>NextResponse</code>나 <code>middleware</code>를 사용해야 합니다.</li>
              <li><strong>시크릿 토큰 노출 방지</strong>: <code>headers()</code>에서 읽은 민감한 인증 토큰을 Client Component의 Props로 그대로 전달하지 않도록 주의해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
