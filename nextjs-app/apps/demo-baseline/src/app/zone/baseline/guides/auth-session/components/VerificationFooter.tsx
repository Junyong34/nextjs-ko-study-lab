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

  const defaultExpected = "• Next.js 인증 & 세션 기반 역할 분기 (RBAC)의 동작과 기대 결과를 확인합니다."
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
        title="Next.js 인증 & 세션 기반 역할 분기 (RBAC) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="Next.js 인증 & 세션 기반 역할 분기 (RBAC)">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js의 역할 기반 접근 제어(RBAC: Role-Based Access Control)는 HTTP 쿠키 세션 또는 암호화된 JWT 토큰을 서버 컴포넌트(<code>cookies()</code>) 및 미들웨어에서 해석하여, 사용자 권한(Guest, Member, Admin)에 따라 UI와 라우트 접근을 서버사이드에서 안전하게 제어하는 표준 보안 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 일반 회원과 관리자 계정 간의 세션 토글을 시뮬레이션하여, 관리자 전용 정산/통계 위젯 노출 여부와 비인가 사용자 접근 시의 즉각적인 권한 에러 처리 및 로그인 리다이렉트 흐름을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>클라이언트 보안 취약점 원천 차단</strong>: 브라우저 자바스크립트 변조로 관리자 UI를 강제 노출하는 행위가 서버 렌더링 단계에서 원천 무효화됩니다.</li>
                    <li><strong>깜빡임 없는 무결점 초기 렌더링</strong>: 클라이언트에서 세션을 비동기 조회 후 뒤늦게 UI를 숨기는 깜빡임(Layout Shift) 현상이 전혀 발생하지 않습니다.</li>
                    <li><strong>세분화된 권한 검증 모듈화</strong>: 서버 컴포넌트, Server Action, Route Handler 전 계층에서 공통 세션 검증 유틸리티를 재사용합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 파트너 판매자 콘솔의 정산 내역 및 주문 관리 시스템</li>
                    <li>사내 인트라넷 임직원 직급별 인사 정보 및 결재 승인 화면</li>
                    <li>유료 구독 멤버십 회원 전용 프리미엄 VOD 콘텐츠 뷰어</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Server Action 내부 세션 revalidation 필수</strong>: 화면에서 버튼을 숨겼더라도 Server Action의 Action ID를 직접 호출할 수 있으므로, 액션 함수 내부에서 세션 및 역할을 반드시 재검사해야 합니다.</li>
                    <li><strong>쿠키 보안 속성(httpOnly, secure)</strong>: 세션 토큰을 담는 쿠키는 XSS 공격에 대비하여 반드시 <code>httpOnly: true</code>, <code>secure: true</code>, <code>sameSite: 'lax'</code>를 적용해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
