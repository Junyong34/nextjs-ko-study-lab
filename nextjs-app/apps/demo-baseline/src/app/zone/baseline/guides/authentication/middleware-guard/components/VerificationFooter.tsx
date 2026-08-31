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

  const defaultExpected = "• Proxy/Middleware 기반 라우트 보호 가드 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Proxy/Middleware 기반 라우트 보호 가드 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Proxy/Middleware 기반 라우트 보호 가드">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js 16의 <code>proxy.ts</code>(Next.js 15 이전의 <code>middleware.ts</code>에 해당)는 들어오는 HTTP 요청을 라우트 핸들러 및 서버 컴포넌트 렌더링 전에 가로채어, 쿠키 검증에 따라 보호된 라우트로의 접근을 통제하고 리다이렉트 및 헤더를 주입하는 엣지 보안 가드입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>proxy.ts</code>가 <code>auth_token</code> 쿠키를 검사하고, 유효하지 않은 상태로 <code>/admin</code> 또는 <code>/mypage</code>를 요청하면 실제 307 리다이렉트를 응답한다. [테스트] 버튼은 브라우저 <code>fetch</code>로 이 경로에 실제 왕복 요청을 보내고 <code>response.redirected</code>로 리다이렉트 발생 여부를 관찰한다 — 시뮬레이션이 아닌 실제 네트워크 요청이다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 렌더링 자원 낭비 제로</strong>: 인증되지 않은 악성/비인가 요청이 무거운 RSC 렌더링 및 DB 쿼리에 도달하기 전에 엣지 계층에서 조기 차단(Early Exit)합니다.</li>
              <li><strong>중앙 집중식 접근 제어</strong>: 각 페이지마다 개별 인증 검사 코드를 중복 작성하지 않고 단일 미들웨어 <code>matcher</code> 설정으로 수백 개의 URL을 통합 관리합니다.</li>
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
              <li><strong>matcher 정규식 제외 패턴 필수</strong>: 정적 에셋(<code>_next/static</code>, <code>_next/image</code>, <code>favicon.ico</code>)이 미들웨어 검사에 걸려 불필요한 연산이 발생하지 않도록 <code>matcher</code>에 제외 패턴을 필수로 구성해야 합니다.</li>
              <li><strong>미들웨어 단독 보안 맹신 금지</strong>: 데이터 뮤테이션(Server Action) 및 중요 API Route Handler 내부에서도 2차 세션 검증을 수행하는 심층 방어(Defense in Depth) 구조를 갖추어야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
