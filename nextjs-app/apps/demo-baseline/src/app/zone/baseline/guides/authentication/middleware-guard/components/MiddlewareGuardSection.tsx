'use client'

import React, { useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { MiddlewareGuardDemo } from './MiddlewareGuardDemo'
import { VerificationFooter } from './VerificationFooter'
import type { AuthCookieState, RouteGuardTestResult } from '../types'

interface MiddlewareGuardSectionProps {
  initialState: AuthCookieState
}

export function MiddlewareGuardSection({ initialState }: MiddlewareGuardSectionProps) {
  const [shared, setShared] = useState<{ authState: AuthCookieState; lastResult: RouteGuardTestResult | null }>({
    authState: initialState,
    lastResult: null,
  })

  const { authState, lastResult } = shared
  const expectedDecision = authState.hasAuth ? 'ALLOWED' : 'REDIRECTED'
  const isProtectedProbe = lastResult ? lastResult.path.startsWith('/admin') || lastResult.path.startsWith('/mypage') : false
  const isMatched = lastResult
    ? isProtectedProbe
      ? lastResult.decision === expectedDecision
      : lastResult.decision === 'ALLOWED'
    : undefined

  const actual = lastResult
    ? `- 요청 경로: ${lastResult.path}\n- HTTP 판정: ${lastResult.status} (${lastResult.decision})\n- 사유: ${lastResult.reason}${
        lastResult.redirectUrl ? `\n- 리다이렉트 응답 URL: ${lastResult.redirectUrl}` : ''
      }`
    : undefined

  return (
    <>
      <DemoPlaygroundCard title="Proxy/Middleware 기반 라우트 보호 가드 실습">
        <MiddlewareGuardDemo initialState={initialState} onResult={setShared} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={isMatched}
        actual={actual}
        expected="auth_token 쿠키가 없으면 /admin, /mypage 요청이 proxy.ts에 의해 307로 리다이렉트되고, 쿠키가 있으면 통과한다. 공개 라우트는 인증과 무관하게 항상 통과한다."
      />
    </>
  )
}
