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

  const defaultExpected = "• Server Action 내 redirect() (303 See Other)의 동작과 기대 결과를 확인합니다."
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
        title="Server Action 내 redirect() (303 See Other) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="redirect() Server Action 내 HTTP 303 Post-Redirect-Get">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Server Action 내부에서 호출되는 <code>redirect()</code> (<code>next/navigation</code>)는 POST 요청 완료 후 클라이언트를 다른 경로로 이동시키는 HTTP 303 See Other 리다이렉트를 수행합니다. 중복 폼 제출(F5 새로고침)을 방지하는 PRG(Post-Redirect-Get) 패턴의 표준입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 주문 결제 폼 제출 시 Server Action에서 DB 결제 처리를 마친 후 <code>redirect('/orders/success?orderId=ORD-99')</code>를 호출하여, 브라우저가 GET 요청으로 주문 완료 페이지를 새로 조회하도록 안전하게 전환합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>중복 결제/주문 원천 차단</strong>: POST 요청 성공 후 즉시 GET 페이지로 이동하여 브라우저 새로고침 시 주문이 중복 생성되는 결제 사고를 방지합니다.</li>
              <li><strong>부드러운 화면 전환</strong>: 클라이언트 자바스크립트 내비게이션과 결합하여 깜빡임 없는 SPA 이동 경험을 제공합니다.</li>
              <li><strong>Action 파이프라인 자동 종료</strong>: 함수 실행 즉시 <code>NEXT_REDIRECT</code> 예외를 던져 후속 불필요한 코드 실행을 방지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 주문서 작성 및 결제 완료 후 주문 완료 결과 페이지로 이동</li>
              <li>회원가입 완료 후 환영 페이지 또는 로그인 화면으로 이동</li>
              <li>게시글 작성/수정 완료 후 작성된 상세 글 보기 화면으로 이동</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>try/catch 내부 호출 금지</strong>: <code>redirect()</code>는 내부적으로 에러를 throw하므로 <code>try/catch</code> 블록 안에 넣으면 catch 절에서 가로채져 리다이렉트가 실패합니다.</li>
              <li><strong>303 vs 307 구분</strong>: Server Action(POST)에서는 303이 사용되며, Route Handler(GET)에서는 307이 기본으로 사용됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
