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

  const defaultExpected = "• Server Component 세션 프로필 렌더링의 동작과 기대 결과를 확인합니다."
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
        title="Server Component 세션 프로필 렌더링 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="Server Component 세션 프로필 렌더링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>React Server Component(RSC)는 서버 환경에서 <code>cookies()</code> 또는 <code>headers()</code> API를 호출하여 안전하게 세션 토큰을 읽고, 클라이언트에 민감 토큰을 노출하지 않은 채 인증된 사용자 프로필 HTML/RSC 페이로드를 직접 렌더링하는 서버 주도 인증 패턴입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 서버 컴포넌트가 세션 쿠키를 조회하여 사용자의 멤버십 등급(VIP), 적립 포인트(24,500P), 맞춤 배송지 정보를 서버사이드에서 직접 DB 조회 후 렌더링하여, 클라이언트 JS 워터폴 없이 초기 로딩 즉시 완성된 개인화 화면을 출력합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트 인증 토큰 유출 제로</strong>: JWT 토큰이나 세션 ID를 브라우저 로컬 스토리지에 노출하지 않고 <code>httpOnly</code> 쿠키로 서버에서만 안전하게 소비합니다.</li>
              <li><strong>클라이언트 워터폴 제거(0 RTT)</strong>: 페이지 렌더링 후 <code>useEffect</code>로 <code>/api/user/me</code>를 다시 호출하던 레거시 SPA 방식 대비 초기 TTFB 단계에서 완제품 UI를 제공합니다.</li>
              <li><strong>SEO 및 깜빡임(Flash of Unstyled Content) 방지</strong>: 비로그인 상태 렌더링 후 로그인 상태로 교체되는 레이아웃 시프트(CLS)를 원천 차단합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상단 GNB 사용자 프로필 뱃지 및 적립금/쿠폰 잔액 표시</li>
              <li>개인 맞춤 추천 상품 및 최근 본 상품 목록 서버 렌더링</li>
              <li>B2B 포털 기업 계정 멤버십 등급 및 결제 한도 대시보드</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>동적 렌더링 전환 인지</strong>: <code>cookies()</code>나 <code>headers()</code>를 호출하는 서버 컴포넌트는 빌드 시 정적 생성이 불가능하며 동적 렌더링(Dynamic Rendering)으로 자동 전환됩니다.</li>
              <li><strong>Suspense 바운더리 격리</strong>: 사용자 프로필 로딩이 느린 백엔드 API와 연결된 경우 상위 레이아웃 전체가 지연되지 않도록 프로필 컴포넌트를 <code>{'<'}Suspense{'>'}</code>로 감싸는 것이 좋습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
