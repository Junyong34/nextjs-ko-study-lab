'use client'
import React, { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { setDemoRoleAction, resetDemoRoleAction } from '../actions'
import { ADMIN_SETTLEMENTS_PATH, type DemoRole } from '../types'

export function ForbiddenTriggerDemo({ currentRole }: { currentRole: DemoRole }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const switchRole = (role: DemoRole) => {
    startTransition(async () => {
      await setDemoRoleAction(role)
      router.refresh()
    })
  }

  const handleReset = () => {
    startTransition(async () => {
      await resetDemoRoleAction()
      router.refresh()
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">스토어 관리자 정산/매출 대시보드 (/admin/settlements)</h4>
          <p className="text-xs text-zinc-500">
            현재 세션 역할 ={' '}
            <strong className={currentRole === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-700 dark:text-zinc-300'}>
              {currentRole === 'admin' ? '스토어 관리자 (ADMIN)' : '일반 고객 (CUSTOMER)'}
            </strong>
          </p>
        </div>
        <DemoResetButton onReset={handleReset} label="CUSTOMER로 초기화" disabled={isPending} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500">역할 전환 (실제 쿠키 기반 서버 세션):</span>
        <button
          onClick={() => switchRole('customer')}
          disabled={isPending || currentRole === 'customer'}
          className="rounded px-2.5 py-1 text-xs font-semibold cursor-pointer bg-zinc-900 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          일반 고객 (CUSTOMER)
        </button>
        <button
          onClick={() => switchRole('admin')}
          disabled={isPending || currentRole === 'admin'}
          className="rounded px-2.5 py-1 text-xs font-semibold cursor-pointer bg-purple-600 text-white disabled:opacity-50"
        >
          스토어 관리자 (ADMIN)
        </button>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <p className="mb-3 text-xs text-blue-700 dark:text-blue-300">
          아래 링크는 실제 Next.js 라우트(<code>/admin/settlements</code>)로 이동합니다. 이동한 페이지의 서버 컴포넌트가
          방금 설정한 세션 쿠키를 읽어 <code>forbidden()</code>을 호출할지 직접 판단합니다.
        </p>
        <Link
          href={ADMIN_SETTLEMENTS_PATH}
          className="inline-block rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
        >
          정산 관리자 페이지 접근 시도 →
        </Link>
      </div>
    </div>
  )
}
