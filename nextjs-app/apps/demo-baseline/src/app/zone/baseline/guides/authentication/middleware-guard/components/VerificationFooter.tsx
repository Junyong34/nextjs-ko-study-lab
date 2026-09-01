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

  const defaultExpected = "• Proxy 기반 라우트 보호 가드의 동작과 기대 결과를 확인합니다."
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
        title="Proxy 기반 라우트 보호 가드 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="Proxy 기반 라우트 보호 가드">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js 16의 <code>proxy.ts</code>(Next.js 15 이전의 <code>middleware.ts</code>에 해당)는 들어오는 HTTP 요청을 라우트 핸들러와 Server Component 렌더링 전에 가로채어, 쿠키 검증 결과에 따라 보호된 라우트의 접근을 통제하고 리다이렉트와 헤더를 적용합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>proxy.ts</code>가 <code>auth_token</code> 쿠키를 검사하고, 유효하지 않은 상태로 <code>/admin</code> 또는 <code>/mypage</code>를 요청하면 307 리다이렉트를 응답합니다. [테스트] 버튼은 브라우저 <code>fetch</code>로 이 경로에 요청을 보내고 <code>response.redirected</code>로 리다이렉트 여부를 확인합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 렌더링 자원 절약</strong>: 인증되지 않은 요청이 RSC 렌더링과 DB 쿼리에 도달하기 전에 앞단에서 차단할 수 있습니다.</li>
              <li><strong>중앙 집중식 접근 제어</strong>: 각 페이지마다 개별 인증 검사 코드를 중복 작성하지 않고 단일 Proxy <code>matcher</code> 설정으로 여러 URL을 관리합니다.</li>
              <li><strong>원래 경로 복귀 UX</strong>: 로그인 후 원래 요청하려던 목적지 경로(<code>redirect</code> 쿼리)를 보존하여 매끄러운 사용자 경험을 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 마이페이지(주문/배송/결제수단 관리) 비로그인 접근 차단</li>
              <li>관리자 백오피스(<code>/admin/*</code>) 및 정산 대시보드 권한 분기</li>
              <li>구독 결제 회원 전용 프리미엄 콘텐츠 라우트 보호</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>matcher 정규식 제외 패턴 확인</strong>: 정적 에셋(<code>_next/static</code>, <code>_next/image</code>, <code>favicon.ico</code>)이 Proxy 검사에 걸리지 않도록 <code>matcher</code> 제외 패턴을 확인합니다.</li>
              <li><strong>Proxy에만 의존하지 않기</strong>: 데이터 변경(Server Action)과 중요한 API Route Handler 내부에서도 2차 세션 검증을 수행해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
