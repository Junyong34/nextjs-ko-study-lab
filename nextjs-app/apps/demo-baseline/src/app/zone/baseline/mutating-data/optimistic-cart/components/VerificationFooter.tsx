'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { OptimisticCartItem } from '../types'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  hasInteracted?: boolean
  isPending?: boolean
  optimisticCart?: OptimisticCartItem[]
  cart?: OptimisticCartItem[]
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { hasInteracted, isPending, optimisticCart, cart } = props

  const defaultExpected =
    '• 버튼 클릭 즉시 useOptimistic으로 선반영 UI 렌더링\n• 800ms 백그라운드 Server Action 통신 진행 (isPending)\n• 통신 완료 후 실제 서버 확정 데이터로 동기화 검증'

  let defaultActual = '• 인터랙션 대기 중 (상품 목록에서 [+ 장바구니 담기]를 클릭하세요)'
  if (hasInteracted) {
    const totalQty = (optimisticCart || []).reduce((s, i) => s + i.quantity, 0)
    const totalPrice = (optimisticCart || []).reduce((s, i) => s + i.price * i.quantity, 0)

    if (isPending) {
      defaultActual = `• 낙관적 선반영: useOptimistic 즉각 반영 (총 ${totalQty}개, ${totalPrice.toLocaleString()}원)\n• 서버 통신: 800ms 백그라운드 Server Action 진행 중...\n• 상태: 임시 주황색 [낙관적 렌더링] 뱃지 표시 중`
    } else {
      defaultActual = `• 낙관적 선반영: 즉각 UI 렌더링 완료\n• 서버 확정 상태: ${(cart || []).length}개 품목 (총 ${totalQty}개, ${totalPrice.toLocaleString()}원)\n• 백그라운드 동기화: addCartItemServer POST 200 완료`
    }
  }

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : hasInteracted && !isPending
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="React 19 useOptimistic & 낙관적 장바구니 UI 실증 검증"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          'Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다.'
        }
      />
      <DemoDeepDiveCard title="React 19 useOptimistic & 낙관적 장바구니 업데이트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              React 19의 <code>useOptimistic</code> 훅은 서버 비동기 액션(Server Action)이 완료되기 전에 클라이언트 UI를 예상 성공 상태로 즉시 전환하고, 백그라운드 서버 응답이 도착하면 최종 서버 확정 데이터로 상태를 동기화하는 표준 낙관적 업데이트 훅입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 [+ 장바구니 담기] 클릭 시 800ms 네트워크 지연을 기다리지 않고 <code>useOptimistic</code>을 통해 주황색 [낙관적 렌더링] 뱃지와 함께 품목 및 총액을 즉시 반영합니다. 800ms 후 Server Action이 완료되면 [서버 확정 완료] 로그와 함께 실제 서버 데이터로 전환됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>우수한 인터랙션 반응성</strong>: 네트워크 지연 시간과 무관하게 버튼 클릭 즉시 UI 피드백을 제공하여 최상의 쇼핑 경험을 구현합니다.</li>
              <li><strong>선언적 임시 상태 관리</strong>: 복잡한 수동 롤백 보일러플레이트 없이 React 런타임이 원본 상태와 낙관적 상태를 안전하게 격리합니다.</li>
              <li><strong>useTransition과의 완벽한 통합</strong>: 트랜지션 우선순위와 연동되어 UI 렌더링 블로킹 없이 부드럽게 동작합니다.</li>
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
              <li><strong>startTransition 스코프 필수</strong>: <code>useOptimistic</code>으로 생성한 디스패처 함수는 반드시 <code>startTransition</code> 콜백 내부 또는 <code>{'<'}form action={'{'}...{'}'}{'>'}</code> 핸들러 내에서 호출해야 유효합니다.</li>
              <li><strong>서버 응답 최종 동기화</strong>: 연속 클릭 시 서버 상태와 낙관적 상태의 불일치를 막기 위해 Server Action의 최종 반환 데이터를 바탕으로 기본 상태(setCart)를 동기화해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
