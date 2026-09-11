import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'functions/unauthorized/trigger-401/mypage/orders',
)

import React from 'react'
import Link from 'next/link'
import { unauthorized } from 'next/navigation'
import { DemoContainer } from '@study/demo-kit'
import { getCurrentSession } from '../../actions'
import { TRIGGER_401_BASE_PATH } from '../../types'
import { StatusCodeVerifier } from '../../components/StatusCodeVerifier'

export default async function MypageOrdersPage() {
  const session = await getCurrentSession()

  // AUTHENTICATED가 아니면 unauthorized()를 호출해 렌더링을 중단하고, 같은 세그먼트의
  // unauthorized.tsx가 HTTP 401과 함께 렌더링되게 한다. 이 호출은 실제 예외를 던진다.
  if (session !== 'authenticated') {
    unauthorized()
  }

  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3 dark:border-emerald-900/40">
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300">마이페이지 주문 내역</h4>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
              세션이 AUTHENTICATED이므로 unauthorized()가 호출되지 않고 실제 주문 데이터가 렌더링되었습니다.
            </p>
          </div>
          <Link
            href={TRIGGER_401_BASE_PATH}
            className="rounded bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-zinc-900 dark:text-emerald-300"
          >
            ← 데모로 돌아가기
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <span className="rounded bg-emerald-600 px-2 py-0.5 text-white">200 OK</span>
          주문 내역 접근 성공
        </div>
        <div className="grid grid-cols-1 gap-2 font-mono text-xs sm:grid-cols-3">
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">
            주문번호 #20260911-01: 프리미엄 러닝화
          </div>
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">배송 상태: 배송 중</div>
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">결제 금액: ₩129,000</div>
        </div>
      </div>

      <StatusCodeVerifier
        expectedStatus={200}
        title="AUTHENTICATED 접근 실측 응답 검증"
        expectedDescription="session=authenticated -> unauthorized() 미호출 -> 실제 HTTP 200 응답"
      />
    </DemoContainer>
  )
}
