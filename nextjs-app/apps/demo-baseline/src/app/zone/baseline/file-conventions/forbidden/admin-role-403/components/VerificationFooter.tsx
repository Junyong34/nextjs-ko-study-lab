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

  const defaultExpected = "• 비관리자 권한 차단 403 화면 (forbidden.tsx)의 동작과 기대 결과를 확인합니다."
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
        title="비관리자 권한 차단 403 화면 (forbidden.tsx) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="forbidden.tsx & forbidden() 인가(Authorization) 실패 403 차단">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>forbidden()</code> 함수는 서버 컴포넌트나 Route Handler에서 사용자의 역할/권한(RBAC)이 리소스 접근 요구조건을 충족하지 못할 때 <code>NEXT_FORBIDDEN</code> 예외를 throw하여 HTTP 403 Forbidden 상태와 <code>forbidden.tsx</code> 화면을 마운트하는 Next.js 표준 인가(Authorization) API입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 인증은 완료되었으나 일반 구매자(User) 권한을 가진 사용자가 판매자 정산 센터(<code>/admin/settlement</code>)에 접근할 때, <code>forbidden()</code>을 호출하여 상위 GNB는 유지한 채 관리자 전용 403 접근 권한 부족 안내 화면을 렌더링하는 보안 흐름을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>401(인증)과 403(인가)의 명확한 분리</strong>: 로그인 필요 상태(401)와 권한 부족 상태(403)를 전용 파일 컨벤션으로 엄격히 분리하여 처리합니다.</li>
              <li><strong>비즈니스 데이터 무단 노출 원천 차단</strong>: 권한 없는 사용자의 하위 컴포넌트 렌더링 및 DB 쿼리 실행을 서버 레벨에서 즉시 차단합니다.</li>
              <li><strong>역할 기반 사용자 친화 UX</strong>: 단순 에러 대신 필요한 권한 등급 안내 및 관리자 권한 신청 CTA 버튼을 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>일반 회원의 판매자 파트너 센터 정산 및 매출 대시보드 접근 차단</li>
              <li>부운영자의 최고관리자 시스템 환경설정 메뉴 접근 제어</li>
              <li>특정 멤버십(VIP) 전용 비공개 할인 기획전의 일반 회원 접근 차단</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>401 unauthorized()와의 차이점</strong>: <code>unauthorized()</code>는 로그인하지 않은 익명 사용자를 대상으로 로그인 페이지로 유도할 때 사용하며, <code>forbidden()</code>은 로그인은 되었으나 권한(Role/Permission)이 부족한 사용자에게 접근 거부를 알릴 때 사용합니다.</li>
              <li><strong>try/catch 래핑 금지</strong>: <code>forbidden()</code> 역시 Next.js 내부 예외를 throw하므로 <code>try/catch</code>로 감싸서 예외를 삼키지 않도록 주의합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
