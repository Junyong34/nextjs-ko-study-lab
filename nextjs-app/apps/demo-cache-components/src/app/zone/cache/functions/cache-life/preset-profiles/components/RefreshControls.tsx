'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { useObservations } from './ObservationContext'

export function RefreshControls({ requestAt, mode }: { requestAt: string; mode: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { reset } = useObservations()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="space-y-0.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
        <div>
          이번 요청 서버 시각 <strong className="text-zinc-900 dark:text-zinc-100">{requestAt}</strong>
        </div>
        <div>
          서버 모드 <strong className="text-zinc-900 dark:text-zinc-100">{mode}</strong>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => startTransition(() => router.refresh())}
          disabled={isPending}
          className="rounded-md bg-zinc-900 px-3 py-1.5 font-medium text-white shadow-xs transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isPending ? '요청 중...' : '서버에 다시 요청 (router.refresh)'}
        </button>
        <DemoResetButton label="관측 기록 초기화" onReset={reset} />
      </div>
    </div>
  )
}
