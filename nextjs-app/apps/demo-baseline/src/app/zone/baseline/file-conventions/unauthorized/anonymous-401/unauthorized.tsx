import React from 'react'
import Link from 'next/link'
import { DemoContainer } from '@study/demo-kit'
import { BASE_PATH } from './types'
import { StatusCodeVerifier } from './components/StatusCodeVerifier'

export default function AnonymousSessionUnauthorized() {
  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border-2 border-red-500/40 bg-red-50/40 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600 dark:bg-red-900/50 dark:text-red-300">
          401
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            로그인이 필요합니다 (anonymous-401/unauthorized.tsx 활성)
          </h4>
          <p className="text-xs text-zinc-500">
            이 화면은 <code>anonymous-401/</code> 세그먼트 <strong>바로 아래</strong>에 있는 공통{' '}
            <code>unauthorized.tsx</code>입니다. 방금 이동한 하위 라우트 자체에는 전용 <code>unauthorized.tsx</code>가 없어서,
            unauthorized() 예외가 상위로 전파되어 이 파일이 대신 렌더링됐습니다.
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
        title="공통 unauthorized.tsx 실측 응답 검증"
        expectedDescription="session=anonymous, 이 세그먼트에 전용 unauthorized.tsx 없음 -> 상위 anonymous-401/unauthorized.tsx 렌더 -> 실제 HTTP 401"
      />
    </DemoContainer>
  )
}
