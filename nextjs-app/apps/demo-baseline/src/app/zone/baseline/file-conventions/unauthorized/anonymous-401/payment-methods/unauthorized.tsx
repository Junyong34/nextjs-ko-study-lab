import React from 'react'
import Link from 'next/link'
import { DemoContainer } from '@study/demo-kit'
import { BASE_PATH } from '../types'
import { StatusCodeVerifier } from '../components/StatusCodeVerifier'

// anonymous-401/ 에도 unauthorized.tsx가 있지만, 이 파일이 더 가깝기 때문에
// payment-methods 세그먼트에서 던진 unauthorized()는 이 파일을 렌더링한다.
export default function PaymentMethodsUnauthorized() {
  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border-2 border-blue-500/40 bg-blue-50/40 p-6 text-center dark:border-blue-900/50 dark:bg-blue-950/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
          401
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            로그인이 필요합니다 (payment-methods/unauthorized.tsx 전용 파일 활성)
          </h4>
          <p className="text-xs text-zinc-500">
            이 화면은 <code>anonymous-401/payment-methods/</code> 폴더 <strong>안에 직접</strong> 있는 전용{' '}
            <code>unauthorized.tsx</code>입니다. 상위에 있는 공통 <code>anonymous-401/unauthorized.tsx</code>는 더 가까운 이
            파일에 가려져 렌더링되지 않습니다. 민감한 결제 수단 접근 차단은 별도 보안 안내 문구로 노출됩니다.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href={BASE_PATH}
            className="rounded bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            ← ANONYMOUS/AUTHENTICATED 세션 전환하러 돌아가기
          </Link>
        </div>
      </div>

      <StatusCodeVerifier
        expectedStatus={401}
        title="전용 unauthorized.tsx 실측 응답 검증"
        expectedDescription="session=anonymous, 이 세그먼트에 전용 unauthorized.tsx 있음 -> 상위 파일 대신 이 파일 렌더 -> 실제 HTTP 401"
      />
    </DemoContainer>
  )
}
