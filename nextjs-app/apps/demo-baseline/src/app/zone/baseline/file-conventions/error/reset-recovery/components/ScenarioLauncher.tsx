'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DemoResetButton } from '@study/demo-kit'
import { resetOrderStatusAction } from '../actions'
import { SCENARIOS } from '../types'

const BASE_PATH = '/zone/baseline/file-conventions/error/reset-recovery'

export function ScenarioLauncher() {
  const [resetCount, setResetCount] = useState(0)

  async function handleResetStore() {
    await resetOrderStatusAction()
    setResetCount((count) => count + 1)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">주문 상태 조회 케이스 선택</h4>
          <p className="text-xs text-zinc-500">두 주문 모두 실제 서버 attempt 카운터로 성공/실패가 결정됩니다.</p>
        </div>
        <DemoResetButton onReset={handleResetStore} label="서버 카운터 초기화" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={`${BASE_PATH}/order/transient-outage`}
          prefetch={false}
          className="rounded border border-amber-300 bg-amber-50 p-4 text-xs hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/20 dark:hover:bg-amber-950/40"
        >
          <div className="font-bold text-amber-900 dark:text-amber-200">
            {SCENARIOS.transient.label} — {SCENARIOS.transient.orderId}
          </div>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">{SCENARIOS.transient.causeDescription}</p>
        </Link>
        <Link
          href={`${BASE_PATH}/order/persistent-fault`}
          prefetch={false}
          className="rounded border border-rose-300 bg-rose-50 p-4 text-xs hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/20 dark:hover:bg-rose-950/40"
        >
          <div className="font-bold text-rose-900 dark:text-rose-200">
            {SCENARIOS.permanent.label} — {SCENARIOS.permanent.orderId}
          </div>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">{SCENARIOS.permanent.causeDescription}</p>
        </Link>
      </div>
      {resetCount > 0 && (
        <p className="text-[11px] text-zinc-500">
          서버 카운터를 {resetCount}번 초기화했습니다. 케이스에 다시 진입하면 attempt가 1부터 시작합니다.
        </p>
      )}
    </div>
  )
}
