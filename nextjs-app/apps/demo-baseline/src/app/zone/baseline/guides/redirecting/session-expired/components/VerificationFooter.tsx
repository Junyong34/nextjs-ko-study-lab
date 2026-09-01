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

  const defaultExpected = "• 세션 만료 시 returnUrl과 함께 로그인 리다이렉트의 동작과 기대 결과를 확인합니다."
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
        title="세션 만료 시 returnUrl과 함께 로그인 리다이렉트 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="세션 만료 시 로그인 화면 조건부 리다이렉트">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Server Component, Route Handler, 또는 미들웨어에서 쿠키 인증 토큰의 유효성을 검사하여, 토큰이 만료되었거나 누락된 경우 <code>redirect('/login?returnUrl=...')</code>를 즉각 발동하여 미인증 사용자의 비공개 라우트 접근을 서버사이드에서 원천 차단하는 표준 보안 가드 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 [세션 만료 시뮬레이션] 토글을 활성화하고 마이페이지 주문 내역 조회를 시도할 때, 서버 컴포넌트가 세션 만료를 감지하고 원래 접근하려던 경로를 <code>returnUrl</code> 쿼리로 인코딩하여 로그인 페이지로 즉각 리다이렉트하는 보안 방어 파이프라인을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>비인가 접근 제로 딜레이 차단</strong>: 브라우저 화면이 렌더링되기도 전에 서버 단에서 307 리다이렉트를 반환하여 민감 정보 유출을 원천 방지합니다.</li>
                    <li><strong>자연스러운 복귀 UX 제공</strong>: <code>returnUrl</code> 매개변수를 보존하여 사용자가 로그인을 완료한 즉시 이전에 보려던 주문 내역 페이지로 자동 복귀시킵니다.</li>
                    <li><strong>중앙 집중식 인증 가드</strong>: 개별 컴포넌트마다 <code>useEffect</code>로 로그인 여부를 체크하는 안티패턴을 제거하고 서버 레벨에서 일괄 통제합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 마이페이지, 주문 상세, 배송지 관리 화면의 세션 만료 가드</li>
                    <li>관리자 파트너 센터 정산 페이지의 주기적 재인증 리다이렉트</li>
                    <li>장시간 미활동 후 장바구니 결제 단계 진입 시 로그인 안내</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>returnUrl 오픈 리다이렉트 취약점 방어</strong>: 로그인 성공 후 <code>returnUrl</code>로 이동시킬 때 외부 악성 도메인(e.g. <code>https://evil.com</code>)으로 탈취되지 않도록 반드시 상대 경로(Relative URL)인지 검증해야 합니다.</li>
                    <li><strong>미들웨어(Middleware)와의 역할 분담</strong>: 전체 경로에 대한 광범위한 세션 검사는 `middleware.ts`에서, 세부 데이터 권한 검증은 Server Component의 `redirect()`에서 수행하는 2중 방어 구조가 권장됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
