import React from 'react'
import Link from 'next/link'
import { DemoContainer } from '@study/demo-kit'
import { BASE_PATH } from '../types'
import { StatusCodeVerifier } from '../components/StatusCodeVerifier'

// admin-role-403/ 에도 forbidden.tsx가 있지만, 이 파일이 더 가깝기 때문에
// settlement-vault 세그먼트에서 던진 forbidden()은 이 파일을 렌더링한다.
export default function SettlementVaultForbidden() {
  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border-2 border-purple-500/40 bg-purple-50/40 p-6 text-center dark:border-purple-900/50 dark:bg-purple-950/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
          403
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            접근 권한이 없습니다 (settlement-vault/forbidden.tsx 전용 파일 활성)
          </h4>
          <p className="text-xs text-zinc-500">
            이 화면은 <code>admin-role-403/settlement-vault/</code> 폴더 <strong>안에 직접</strong> 있는 전용{' '}
            <code>forbidden.tsx</code>입니다. 상위에 있는 공통 <code>admin-role-403/forbidden.tsx</code>는 더 가까운 이 파일에
            가려져 렌더링되지 않습니다. 민감한 정산 금고 접근 거부는 별도 안내 문구로 노출됩니다.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href={BASE_PATH}
            className="rounded bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            ← CUSTOMER/ADMIN 역할 전환하러 돌아가기
          </Link>
        </div>
      </div>

      <StatusCodeVerifier
        expectedStatus={403}
        title="전용 forbidden.tsx 실측 응답 검증"
        expectedDescription="role!=admin, 이 세그먼트에 전용 forbidden.tsx 있음 -> 상위 파일 대신 이 파일 렌더 -> 실제 HTTP 403"
      />
    </DemoContainer>
  )
}
