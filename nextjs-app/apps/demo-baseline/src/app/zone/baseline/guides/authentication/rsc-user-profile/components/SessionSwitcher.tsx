'use client'
import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { SessionRole } from '../types'
import { switchSessionRoleAction } from '../actions'

export function SessionSwitcher({ currentGrade }: { currentGrade: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSwitch = (role: SessionRole) => {
    startTransition(async () => {
      await switchSessionRoleAction(role)
      // 로컬 상태 재작성이 아니라, 실제 서버 컴포넌트를 다시 요청해 RSC가 새 쿠키로 프로필을 재조회하게 한다.
      router.refresh()
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="text-xs">
        <span className="font-semibold text-zinc-600 dark:text-zinc-400">서버 세션 제어:</span>
        <span className="ml-2 font-mono text-zinc-800 dark:text-zinc-200">
          현재 쿠키 등급 = <strong className="text-blue-600 dark:text-blue-400">{currentGrade}</strong>
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => handleSwitch('vip')} disabled={isPending || currentGrade === 'VIP'} className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
          VIP 세션
        </button>
        <button type="button" onClick={() => handleSwitch('regular')} disabled={isPending || currentGrade === 'REGULAR'} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer">
          일반 회원
        </button>
        <button type="button" onClick={() => handleSwitch('guest')} disabled={isPending || currentGrade === 'GUEST'} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer">
          로그아웃
        </button>
      </div>
    </div>
  )
}
