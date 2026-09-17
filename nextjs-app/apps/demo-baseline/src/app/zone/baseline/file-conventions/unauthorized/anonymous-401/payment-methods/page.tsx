import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/unauthorized/anonymous-401/payment-methods',
)

import React from 'react'
import Link from 'next/link'
import { unauthorized } from 'next/navigation'
import { DemoContainer } from '@study/demo-kit'
import { getCurrentSession } from '../actions'
import { BASE_PATH } from '../types'
import { StatusCodeVerifier } from '../components/StatusCodeVerifier'

// 이 세그먼트에는 같은 폴더에 전용 unauthorized.tsx가 있다(./unauthorized.tsx).
// session=anonymous일 때 unauthorized()가 던지는 예외는 상위로 전파되지 않고
// 가장 가까운 이 파일이 상위 anonymous-401/unauthorized.tsx보다 먼저 렌더링된다.
export default async function PaymentMethodsPage() {
  const session = await getCurrentSession()

  if (session !== 'authenticated') {
    unauthorized()
  }

  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3 dark:border-emerald-900/40">
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300">결제 수단 관리 (카드/계좌)</h4>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
              세션 상태가 AUTHENTICATED이므로 unauthorized()가 호출되지 않고 실제 결제 수단 데이터가 렌더링되었습니다. 이
              폴더에는 전용 unauthorized.tsx가 있다는 점을 기억해 두세요.
            </p>
          </div>
          <Link
            href={BASE_PATH}
            className="rounded bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-zinc-900 dark:text-emerald-300"
          >
            ← 데모로 돌아가기
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <span className="rounded bg-emerald-600 px-2 py-0.5 text-white">200 OK</span>
          결제 수단 접근 성공
        </div>
        <div className="grid grid-cols-1 gap-2 font-mono text-xs sm:grid-cols-3">
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">등록 카드: 2건</div>
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">간편결제: 1건</div>
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">계좌 등록: 1건</div>
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
