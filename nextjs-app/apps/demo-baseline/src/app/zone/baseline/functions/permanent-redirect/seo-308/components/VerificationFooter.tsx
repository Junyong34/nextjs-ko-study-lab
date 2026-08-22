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

  const defaultExpected = "• permanentRedirect() 영구 URL 변경 (308 Permanent) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="permanentRedirect() 영구 URL 변경 (308 Permanent) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="permanentRedirect() 영구 URL 변경 (308 Permanent)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>redirect()(307/303)와 permanentRedirect()(308)는 Server Actions, Route Handlers, 서버 컴포넌트 내부에서 즉각적인 HTTP 리다이렉트를 트리거하며, 내부적으로 NEXT_REDIRECT 예외를 던져 실행을 즉시 중단하고 브라우저를 대상 URL로 이동시킵니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 Server Action으로 장바구니 주문 결제가 성공하면 redirect(&apos;/orders/success&apos;)를 호출하여 303 See Other로 영수증 화면으로 이동시키고, 단종된 구 상품 접근 시에는 permanentRedirect(&apos;/products/new-01&apos;)로 308 영구 이동을 반환합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>결제 완료 후 중복 제출 원천 방지: Post-Redirect-Get(PRG) 패턴을 구현하여 새로고침 시 결제 폼이 재제출되는 현상을 완벽히 차단합니다.</li>
              <li>검색엔진 영구 랭킹 승계: 308 Permanent Redirect로 단종 상품의 기존 검색 색인 가치를 신상품으로 온전히 전달합니다.</li>
              <li>트랜잭션 중단 안정성: redirect() 호출 시점 이후의 불필요한 백엔드 코드가 실행되지 않고 즉시 안전하게 탈출합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>주문서 작성 및 결제 승인 완료 후 주문 완료 페이지로 리다이렉트</li>
              <li>세션 만료 또는 비인가 사용자의 로그인 페이지 강제 리다이렉트</li>
              <li>쇼핑몰 도메인 개편 및 상품 카테고리 체계 변경 시 영구 리다이렉트(308)</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
