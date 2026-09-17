import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/forbidden/admin-role-403/general-notice',
)

import React from 'react'
import Link from 'next/link'
import { forbidden } from 'next/navigation'
import { DemoContainer } from '@study/demo-kit'
import { getCurrentDemoRole } from '../actions'
import { BASE_PATH } from '../types'
import { StatusCodeVerifier } from '../components/StatusCodeVerifier'

// 이 세그먼트에는 자체 forbidden.tsx가 없다. role!=admin으로 forbidden()이
// 던지는 예외는 상위 admin-role-403/forbidden.tsx까지 전파되어 그 파일이 렌더링된다.
export default async function GeneralNoticePage() {
  const role = await getCurrentDemoRole()

  if (role !== 'admin') {
    forbidden()
  }

  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3 dark:border-emerald-900/40">
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300">전체 공지 관리</h4>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
              세션 역할이 ADMIN이므로 forbidden()이 호출되지 않고 공지 관리 화면이 렌더링되었습니다. 이 폴더에는 전용
              forbidden.tsx가 없다는 점을 기억해 두세요.
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
          공지 목록 접근 성공
        </div>
        <div className="grid grid-cols-1 gap-2 font-mono text-xs sm:grid-cols-3">
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">등록된 공지: 12건</div>
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">고정 공지: 2건</div>
          <div className="rounded border bg-white p-2 dark:border-emerald-900/40 dark:bg-zinc-900">임시 저장: 1건</div>
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
