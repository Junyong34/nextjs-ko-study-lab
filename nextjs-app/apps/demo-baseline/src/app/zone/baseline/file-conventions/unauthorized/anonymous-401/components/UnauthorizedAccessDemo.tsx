'use client'
import React, { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { setSessionAction, resetSessionAction } from '../actions'
import { ORDER_HISTORY_PATH, PAYMENT_METHODS_PATH, type SessionState } from '../types'

export function UnauthorizedAccessDemo({ currentSession }: { currentSession: SessionState }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const switchSession = (session: SessionState) => {
    startTransition(async () => {
      await setSessionAction(session)
      router.refresh()
    })
  }

  const handleReset = () => {
    startTransition(async () => {
      await resetSessionAction()
      router.refresh()
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">마이페이지 전용 구역 (anonymous-401/*)</h4>
          <p className="text-xs text-zinc-500">
            현재 세션 상태 ={' '}
            <strong className={currentSession === 'authenticated' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-300'}>
              {currentSession === 'authenticated' ? '로그인 회원 (AUTHENTICATED)' : '비로그인 방문자 (ANONYMOUS)'}
            </strong>
          </p>
        </div>
        <DemoResetButton onReset={handleReset} label="ANONYMOUS로 초기화" disabled={isPending} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500">세션 전환 (실제 쿠키 기반 서버 세션):</span>
        <button
          onClick={() => switchSession('anonymous')}
          disabled={isPending || currentSession === 'anonymous'}
          className="rounded px-2.5 py-1 text-xs font-semibold cursor-pointer bg-zinc-900 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          비로그인 방문자 (ANONYMOUS)
        </button>
        <button
          onClick={() => switchSession('authenticated')}
          disabled={isPending || currentSession === 'authenticated'}
          className="rounded px-2.5 py-1 text-xs font-semibold cursor-pointer bg-blue-600 text-white disabled:opacity-50"
        >
          로그인 회원 (AUTHENTICATED)
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <p className="mb-1 font-mono text-[11px] text-amber-800 dark:text-amber-300">anonymous-401/order-history/</p>
          <p className="mb-3 text-xs text-amber-700 dark:text-amber-300">
            이 폴더에는 <strong>전용 unauthorized.tsx가 없습니다</strong>. ANONYMOUS로 접근하면 unauthorized() 예외가 상위로
            전파되어 <code>anonymous-401/unauthorized.tsx</code>(공통 파일)가 렌더링됩니다.
          </p>
          <Link
            href={ORDER_HISTORY_PATH}
            className="inline-block rounded bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 cursor-pointer"
          >
            주문 내역 조회 →
          </Link>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
          <p className="mb-1 font-mono text-[11px] text-blue-800 dark:text-blue-300">anonymous-401/payment-methods/</p>
          <p className="mb-3 text-xs text-blue-700 dark:text-blue-300">
            이 폴더에는 <strong>같은 위치에 전용 unauthorized.tsx가 있습니다</strong>. ANONYMOUS로 접근하면 상위 공통 파일 대신
            이 폴더의 전용 파일이 렌더링됩니다.
          </p>
          <Link
            href={PAYMENT_METHODS_PATH}
            className="inline-block rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            결제 수단 관리 →
          </Link>
        </div>
      </div>
    </div>
  )
}
