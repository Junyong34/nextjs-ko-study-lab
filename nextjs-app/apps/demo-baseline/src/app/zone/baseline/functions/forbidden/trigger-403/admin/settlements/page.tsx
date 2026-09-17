import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'functions/forbidden/trigger-403/admin/settlements',
)

import React from 'react'
import Link from 'next/link'
import { forbidden } from 'next/navigation'
import { DemoContainer } from '@study/demo-kit'
import { getCurrentDemoRole } from '../../actions'
import { TRIGGER_403_BASE_PATH } from '../../types'
import { StatusCodeVerifier } from '../../components/StatusCodeVerifier'

export default async function AdminSettlementsPage() {
  const role = await getCurrentDemoRole()

  // ADMIN이 아니면 forbidden()을 호출해 렌더링을 중단하고, 같은 세그먼트의
  // forbidden.tsx가 HTTP 403과 함께 렌더링되게 한다. 이 호출은 실제 예외를 던진다.
  if (role !== 'admin') {
    forbidden()
  }

  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3 dark:border-emerald-900/40">
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300">스토어 관리자 정산/매출 대시보드</h4>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
              세션 역할이 ADMIN이므로 forbidden()이 호출되지 않고 실제 정산 데이터가 렌더링되었습니다.
            </p>
          </div>
          <Link
            href={TRIGGER_403_BASE_PATH}
            className="rounded bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-zinc-900 dark:text-emerald-300"
          >
            ← 데모로 돌아가기
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <span className="rounded bg-emerald-600 px-2 py-0.5 text-white">200 OK</span>
          정산 데이터 접근 성공
        </div>
        <div className="grid grid-cols-1 gap-2 font-mono text-xs sm:grid-cols-3">
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">당월 총 매출: ₩128,450,000</div>
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">정산 예정액: ₩115,605,000</div>
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">미결 주문: 14건</div>
        </div>
      </div>

      <StatusCodeVerifier
        expectedStatus={200}
        title="ADMIN 접근 실측 응답 검증"
        expectedDescription="role=admin -> forbidden() 미호출 -> 실제 HTTP 200 응답"
      />
    </DemoContainer>
  )
}
