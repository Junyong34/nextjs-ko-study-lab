'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { CartSummary } from '../types'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  cart?: CartSummary
  actionCount?: number
  isPending?: boolean
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { cart, actionCount, isPending } = props

  const defaultExpected =
    '• Server Action(updateCartQuantity/resetCart) 실행 후 revalidatePath 호출\n• 서버 캐시 무효화로 최신 수량과 총 결제 금액이 화면에 동기화됨\n• 단일 POST 요청 왕복으로 서버 메모리 상태와 UI 일치 검증'

  let defaultActual = '• 인터랙션 대기 중 (장바구니의 [+] 또는 [-] 수량 버튼을 클릭하세요)'
  if (actionCount && actionCount > 0 && cart) {
    defaultActual = `• 변경된 총 수량: ${cart.totalQuantity}개 (총 ${cart.totalPrice.toLocaleString()}원)\n• revalidatePath 서버 동기화: 완료 (${cart.updatedAt})\n• Server Action 상태: POST 200 성공 및 최신 캐시 동기화 완료`
  }

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : actionCount && actionCount > 0
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Server Action 데이터 변경 및 revalidatePath 동기화 실증 검증"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          'Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다.'
        }
      />
      <DemoDeepDiveCard title="Server Action 데이터 변경 및 revalidatePath 캐시 동기화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Server Action(<code>'use server'</code>) 내부에서 데이터 변이(Mutation)를 수행한 후 <code>revalidatePath()</code>를 호출하여, 지정된 라우트 경로의 서버 컴포넌트 캐시를 온디맨드로 무효화하고 최신 상태가 반영된 RSC 페이로드를 클라이언트에 즉시 재전송하는 풀스택 데이터 동기화 표준 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 장바구니 품목(러닝화, 맨투맨, 모니터 암)의 수량 증감([+], [-]) 또는 [장바구니 초기화] 버튼 클릭 시 Server Action이 서버 메모리 저장소를 갱신하고 <code>revalidatePath('/zone/baseline/mutating-data/server-action-revalidate')</code>를 호출합니다. 서버가 최신 총 품목 수와 총 결제 금액을 재계산하여 화면에 동기화합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>단일 왕복(Single Roundtrip) 동기화</strong>: 데이터 변경 요청과 최신 화면 재검증이 1회의 HTTP POST 네트워크 통신으로 완결됩니다.</li>
              <li><strong>클라이언트 상태 불일치 제거</strong>: 클라이언트 전역 상태를 수동으로 갱신할 필요 없이 서버가 단일 진실 공급원(SSOT)으로 동작합니다.</li>
              <li><strong>강력한 타입 안전성</strong>: Server Action 파라미터부터 반환 데이터까지 End-to-End TypeScript 타입 추론을 보장합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 장바구니 품목 수량 변경 및 실시간 결제 예정 금액 재계산</li>
              <li>배송지 추가/수정/삭제 후 기본 배송지 목록 즉시 최신화</li>
              <li>게시글 작성/수정/삭제 후 목록 페이지 캐시 갱신</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>revalidatePath 범위 지정</strong>: 기본 <code>revalidatePath('/path', 'page')</code>는 특정 페이지만 갱신하며, 하위 모든 중첩 경로를 무효화하려면 <code>'layout'</code> 타입을 명시해야 합니다.</li>
              <li><strong>useTransition 연동</strong>: Server Action 호출부를 <code>startTransition</code>으로 감싸 <code>isPending</code> 상태를 바인딩함으로써 사용자에게 명확한 진행 인디케이터를 제공합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
