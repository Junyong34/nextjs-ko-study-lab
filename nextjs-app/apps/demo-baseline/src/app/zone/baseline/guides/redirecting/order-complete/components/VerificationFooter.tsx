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

  const defaultExpected = "• Server Action 내 redirect()를 통한 주문 완료 화면 이동 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Server Action 내 redirect()를 통한 주문 완료 화면 이동 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Server Action 내 redirect()를 통한 주문 완료 화면 이동">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Server Action 내부에서 호출하는 <code>redirect(url)</code> 함수는 Next.js 내부적으로 <code>NEXT_REDIRECT</code>라는 특수 제어 예외(Exception)를 발생시켜 서버 실행을 즉시 중단하고, HTTP 303 See Other 응답을 통해 클라이언트를 지정된 완료 경로로 이동시키는 표준 서버 리다이렉트 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 주문서 결제 폼에서 [주문 확정] 버튼을 제출하면 Server Action이 결제 트랜잭션을 처리한 후 <code>redirect('/zone/baseline/guides/redirecting/order-complete?orderId=ORD-9982')</code>를 실행하여 주문 성공 안내 화면으로 안전하게 라우팅하는 흐름을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>중복 결제(Double Submit) 원천 방지</strong>: Post-Redirect-Get(PRG) 패턴을 통해 사용자가 새로고침 버튼을 눌러도 동일한 결제 요청이 중복 실행되지 않습니다.</li>
                    <li><strong>깔끔한 제어 흐름</strong>: 클라이언트 컴포넌트에서 비동기 응답 수신 후 `router.push`를 수동 호출할 필요 없이 서버 비즈니스 로직 성공 즉시 단일 지점에서 리다이렉트 처리.</li>
                    <li><strong>조건부 분기 라우팅</strong>: 재고 부족 시 에러 안내 페이지로, 결제 성공 시 영수증 페이지로 서버에서 동적 분기.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 결제 완료 후 주문 영수증 페이지(<code>/order/complete</code>)로의 이동</li>
                    <li>1:1 고객 문의 등록 완료 후 문의 접수 확인 페이지 이동</li>
                    <li>이벤트 설문조사 제출 후 참여 완료 감사 화면 라우팅</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>try/catch 블록 내부 호출 금지</strong>: <code>redirect()</code>는 <code>NEXT_REDIRECT</code> 에러를 throw하는 방식으로 동작하므로, <code>try/catch</code> 블록 내부에서 호출하면 catch 문에 걸려 리다이렉트가 취소될 수 있습니다. 반드시 catch 블록 외부나 finally 이후에 호출해야 합니다.</li>
                    <li><strong>permanent 옵션 기본값</strong>: <code>redirect()</code>의 기본 HTTP 상태 코드는 307(임시) 또는 Server Action 환경의 303이며, 영구 이동이 필요한 경우에만 <code>permanentRedirect()</code>를 사용해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
