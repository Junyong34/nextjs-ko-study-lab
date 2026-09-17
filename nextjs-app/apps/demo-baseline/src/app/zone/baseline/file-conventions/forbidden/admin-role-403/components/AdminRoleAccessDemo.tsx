'use client'
import React, { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { setDemoRoleAction, resetDemoRoleAction } from '../actions'
import { GENERAL_NOTICE_PATH, SETTLEMENT_VAULT_PATH, type DemoRole } from '../types'

export function AdminRoleAccessDemo({ currentRole }: { currentRole: DemoRole }) {
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
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">관리자 전용 구역 (admin-role-403/*)</h4>
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

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
          <p className="mb-1 font-mono text-[11px] text-blue-800 dark:text-blue-300">admin-role-403/general-notice/</p>
          <p className="mb-3 text-xs text-blue-700 dark:text-blue-300">
            이 폴더에는 <strong>전용 forbidden.tsx가 없습니다</strong>. CUSTOMER로 접근하면 forbidden() 예외가 상위로
            전파되어 <code>admin-role-403/forbidden.tsx</code>(공통 파일)가 렌더링됩니다.
          </p>
          <Link
            href={GENERAL_NOTICE_PATH}
            className="inline-block rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            전체 공지 관리 →
          </Link>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/50 dark:bg-purple-950/20">
          <p className="mb-1 font-mono text-[11px] text-purple-800 dark:text-purple-300">admin-role-403/settlement-vault/</p>
          <p className="mb-3 text-xs text-purple-700 dark:text-purple-300">
            이 폴더에는 <strong>같은 위치에 전용 forbidden.tsx가 있습니다</strong>. CUSTOMER로 접근하면 상위 공통 파일 대신
            이 폴더의 전용 파일이 렌더링됩니다.
          </p>
          <Link
            href={SETTLEMENT_VAULT_PATH}
            className="inline-block rounded bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 cursor-pointer"
          >
            정산 금고 →
          </Link>
        </div>
      </div>
    </div>
  )
}
