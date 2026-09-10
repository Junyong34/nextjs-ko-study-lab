import React from 'react'
import Link from 'next/link'
import { DemoContainer } from '@study/demo-kit'
import { TRIGGER_403_BASE_PATH } from '../../types'
import { StatusCodeVerifier } from '../../components/StatusCodeVerifier'

export default function SettlementsForbidden() {
  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border-2 border-red-500/40 bg-red-50/40 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600 dark:bg-red-900/50 dark:text-red-300">
          403
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            접근 권한이 없습니다 (forbidden.tsx 활성)
          </h4>
          <p className="text-xs text-zinc-500">
            스토어 입점사 관리자 전용 정산 화면입니다. 이 UI는 <code>/admin/settlements</code> 세그먼트에서{' '}
            <code>forbidden()</code>이 호출되어 렌더링된 실제 <code>forbidden.tsx</code> 파일 컨벤션입니다.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href={TRIGGER_403_BASE_PATH}
            className="rounded bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            ← CUSTOMER/ADMIN 역할 전환하러 돌아가기
          </Link>
        </div>
      </div>

      <StatusCodeVerifier
        expectedStatus={403}
        title="CUSTOMER 접근 실측 응답 검증"
        expectedDescription="role!=admin -> forbidden() 호출 -> 실제 HTTP 403 응답"
      />
    </DemoContainer>
  )
}
