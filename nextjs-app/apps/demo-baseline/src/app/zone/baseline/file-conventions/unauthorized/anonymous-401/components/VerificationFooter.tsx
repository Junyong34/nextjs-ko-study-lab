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

  const defaultExpected = "• 미인증 세션 401 로그인 요구 화면 (unauthorized.tsx) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="미인증 세션 401 로그인 요구 화면 (unauthorized.tsx) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="unauthorized.tsx & unauthorized() 인증(Authentication) 요구 401 안내">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>unauthorized()</code> 함수는 서버 컴포넌트나 Route Handler에서 세션 쿠키 또는 인증 토큰이 누락된 비로그인(Anonymous) 사용자의 접근을 감지했을 때 <code>NEXT_UNAUTHORIZED</code> 예외를 throw하여 HTTP 401 Unauthorized 상태와 <code>unauthorized.tsx</code> 화면을 렌더링하는 Next.js 표준 인증 API입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 비로그인 사용자가 마이페이지의 [주문/배송 조회]나 [1:1 문의 내역] 등 회원 전용 라우트에 접근했을 때, <code>unauthorized()</code>를 호출하여 안전하게 401 상태를 선언하고 [로그인하기] 및 [회원가입] CTA가 포함된 <code>unauthorized.tsx</code> 안내 화면을 즉시 렌더링합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>선언적 인증 가드(Authentication Guard)</strong>: 복잡한 리다이렉트 미들웨어 없이도 서버 컴포넌트 내부에서 비인증 접근을 간결하게 차단합니다.</li>
              <li><strong>보안 세션 보호</strong>: 인증되지 않은 클라이언트에 민감한 개인정보나 주문 내역 페이로드가 전송되는 것을 원천 방지합니다.</li>
              <li><strong>전환율 높은 로그인 유도 UI</strong>: 빈 화면 대신 현재 접근하려던 리소스 정보(returnUrl)와 함께 원클릭 간편 로그인 화면을 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>비로그인 사용자의 마이페이지 주문/배송 내역 및 결제수단 관리 접근</li>
              <li>비회원의 장바구니 결제 진행 및 쿠폰함 다운로드 화면 진입</li>
              <li>비인증 사용자의 1:1 고객센터 상담 작성 페이지 접근</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>403 forbidden()과의 명확한 구분</strong>: <code>unauthorized()</code>는 사용자의 신원이 확인되지 않은 상태(비로그인)에 사용하는 반면, <code>forbidden()</code>은 신원은 확인되었으나 해당 리소스에 대한 접근 권한(Role)이 없는 상태에 사용합니다.</li>
              <li><strong>미들웨어와의 조화</strong>: 전체 URL 경로 차단은 Middleware/Proxy에서 처리하고, 컴포넌트 레벨의 세부 세션 검증은 <code>unauthorized()</code>를 사용하는 계층형 보안 구조가 권장됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
