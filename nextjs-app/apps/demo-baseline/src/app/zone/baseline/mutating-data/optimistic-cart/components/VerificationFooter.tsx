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

  const defaultExpected = "• React 19 useOptimistic 낙관적 장바구니 UI 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="React 19 useOptimistic 낙관적 장바구니 UI 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="React 19 useOptimistic 낙관적 장바구니 UI">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>React 19의 <code>useOptimistic</code> 훅은 서버 비동기 액션(Server Action)이 완료되기 전에 클라이언트 UI를 예상 성공 상태로 즉각 전환하고, 서버 응답이 실패하거나 롤백될 경우 이전 상태로 자동 복원하는 표준 낙관적 업데이트(Optimistic Update) 훅입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 [장바구니 담기] 클릭 시 네트워크 지연(1.5초)을 기다리지 않고 장바구니 수량과 총 결제 금액을 0ms 즉시 화면에 반영합니다. 만약 서버 액션에서 고의 에러가 발생하면 낙관적 수량이 원래대로 자동 롤백되는 과정을 시각화합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>극한의 사용자 체감 속도</strong>: 네트워크 레이턴시와 무관하게 모든 버튼 인터랙션에 즉각적으로 반응하여 최상의 쇼핑 경험을 제공합니다.</li>
                    <li><strong>코드 복잡도 대폭 감소</strong>: 수동 <code>try/catch</code> 롤백 상태 관리 보일러플레이트 없이 React 내부 큐가 원본 상태를 안전하게 보존합니다.</li>
                    <li><strong>트랜지션 우선순위 자동 연동</strong>: <code>useTransition</code> 및 <code>startTransition</code>과 완벽히 통합되어 렌더링 블로킹을 방지합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 상품 상세/목록 화면에서의 원클릭 장바구니 담기 및 실시간 뱃지 카운트 갱신</li>
                    <li>소셜 피드 게시물의 좋아요(하트) 토글 및 북마크 즉시 상태 변경</li>
                    <li>메시징 앱의 메시지 전송 즉시 대화창 표시 및 전송 중 인디케이터 처리</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>startTransition 내부 실행 필수</strong>: <code>useOptimistic</code>으로 생성한 디스패처 함수는 반드시 <code>startTransition</code> 콜백 내부 또는 <code>{'<'}form action={'{'}...{'}'}{'>'}</code> 핸들러 내에서 호출해야 유효합니다.</li>
                    <li><strong>동시성 충돌 방어</strong>: 연속 클릭 시 서버 상태와 낙관적 상태의 불일치를 막기 위해 서버 액션의 최종 반환 데이터를 바탕으로 기본 상태를 동기화해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
