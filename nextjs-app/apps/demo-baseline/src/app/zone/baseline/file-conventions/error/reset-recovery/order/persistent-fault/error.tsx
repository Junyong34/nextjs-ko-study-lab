'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { peekOrderStatusAction } from '../../actions'
import { OrderVerificationPanel } from '../../components/OrderVerificationPanel'
import { SCENARIOS } from '../../types'
import type { OrderStatusResult } from '../../types'

const BASE_PATH = '/zone/baseline/file-conventions/error/reset-recovery'
const config = SCENARIOS.permanent

export default function PersistentFaultError({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string }
  reset: () => void
  retry: () => void
}) {
  const [status, setStatus] = useState<OrderStatusResult | null>(null)
  const [lastAction, setLastAction] = useState<'reset' | 'retry' | null>(null)

  useEffect(() => {
    console.error('주문 조회 에러 바운더리 포착:', error)
    peekOrderStatusAction('permanent').then(setStatus)
  }, [error])

  return (
    <div className="space-y-4 rounded-lg border-2 border-rose-500/40 bg-rose-50/40 p-5 dark:border-rose-900/50 dark:bg-rose-950/20">
      <div className="flex items-center justify-between border-b border-rose-200 pb-3 dark:border-rose-900">
        <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">
          주문 {config.orderId} 조회 실패 (order/persistent-fault/error.tsx)
        </h4>
        <span className="rounded bg-rose-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
          ERROR BOUNDARY
        </span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {error.message || config.causeDescription}
      </p>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 text-xs font-mono text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
        서버 실제 attempt 카운터: {status ? status.attempt : '조회 중...'} / 회복 기준: 도달 불가(설정 오류 미해결)
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-rose-200 pt-2 dark:border-rose-900">
        <Link
          href={BASE_PATH}
          className="rounded bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300"
        >
          데모 홈으로 복귀
        </Link>
        <button
          type="button"
          onClick={() => {
            setLastAction('reset')
            reset()
          }}
          className="cursor-pointer rounded bg-zinc-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-600"
        >
          에러 상태만 초기화 (reset())
        </button>
        <button
          type="button"
          onClick={() => {
            setLastAction('retry')
            retry()
          }}
          className="cursor-pointer rounded bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
        >
          다시 시도 (retry())
        </button>
      </div>
      {lastAction && (
        <p className="text-[11px] text-zinc-500">
          방금 {lastAction === 'retry' ? 'retry()' : 'reset()'}를 호출했습니다. attempt 카운터는 늘어나더라도
          근본 설정 오류가 그대로라 계속 실패 화면이 나타납니다.
        </p>
      )}
      <OrderVerificationPanel scenario="permanent" phase="fail" attempt={status?.attempt} />
    </div>
  )
}
