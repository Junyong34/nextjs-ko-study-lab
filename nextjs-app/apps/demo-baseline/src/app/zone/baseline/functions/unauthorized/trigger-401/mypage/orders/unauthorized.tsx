import React from 'react'
import Link from 'next/link'
import { DemoContainer } from '@study/demo-kit'
import { TRIGGER_401_BASE_PATH } from '../../types'
import { StatusCodeVerifier } from '../../components/StatusCodeVerifier'

export default function OrdersUnauthorized() {
  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border-2 border-red-500/40 bg-red-50/40 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600 dark:bg-red-900/50 dark:text-red-300">
          401
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            로그인이 필요합니다 (unauthorized.tsx 활성)
          </h4>
          <p className="text-xs text-zinc-500">
            회원 전용 주문 내역 화면입니다. 이 UI는 <code>/mypage/orders</code> 세그먼트에서{' '}
            <code>unauthorized()</code>가 호출되어 렌더링된 실제 <code>unauthorized.tsx</code> 파일 컨벤션입니다.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href={TRIGGER_401_BASE_PATH}
            className="rounded bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            ← ANONYMOUS/AUTHENTICATED 세션 전환하러 돌아가기
          </Link>
        </div>
      </div>

      <StatusCodeVerifier
        expectedStatus={401}
        title="ANONYMOUS 접근 실측 응답 검증"
        expectedDescription="session!=authenticated -> unauthorized() 호출 -> 실제 HTTP 401 응답"
      />
    </DemoContainer>
  )
}
