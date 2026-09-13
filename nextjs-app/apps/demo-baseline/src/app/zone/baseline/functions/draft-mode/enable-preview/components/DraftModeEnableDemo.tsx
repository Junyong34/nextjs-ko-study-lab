'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import type { DraftPreviewSnapshot } from '../types'

export interface DraftModeEnableDemoProps {
  isEnabled: boolean
  snapshot: DraftPreviewSnapshot
  enableHref: string
}

export function DraftModeEnableDemo({ isEnabled, snapshot, enableHref }: DraftModeEnableDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [checkCount, setCheckCount] = useState(0)

  // getPreviewSnapshot()이 실제로 재실행됐는지와 무관하게, 재요청 자체가 몇 번 일어났는지 센다.
  useEffect(() => {
    setCheckCount((count) => count + 1)
  }, [snapshot.renderedAt, snapshot.requestId])

  const handleRefetch = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="space-y-3.5 rounded border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-900">
        <div className="font-bold text-zinc-900 dark:text-zinc-100">
          draftMode().isEnabled:{' '}
          <span className={isEnabled ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-500'}>
            {String(isEnabled)}
          </span>
        </div>
        <DemoResetButton
          label="다시 요청 (router.refresh)"
          loadingLabel="재요청 중..."
          onReset={handleRefetch}
          disabled={isPending}
        />
      </div>

      <div className="space-y-1 rounded bg-zinc-50 p-3 font-mono dark:bg-zinc-900">
        <div>
          renderedAt: <span className="font-bold text-zinc-900 dark:text-zinc-100">{snapshot.renderedAt}</span>
        </div>
        <div>
          requestId: <span className="font-bold text-zinc-900 dark:text-zinc-100">{snapshot.requestId}</span>
        </div>
        <div className="text-zinc-500">클라이언트 재요청 횟수: {checkCount}</div>
      </div>

      {!isEnabled ? (
        <form action={enableHref} method="GET">
          <button
            type="submit"
            className="rounded bg-purple-600 px-3.5 py-1.5 font-bold text-white shadow-2xs cursor-pointer"
          >
            draftMode().enable() 실행 (Route Handler 이동)
          </button>
        </form>
      ) : (
        <div className="rounded border border-purple-200 bg-purple-50 p-2.5 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300">
          __prerender_bypass 쿠키가 이미 설정되어 있습니다. [다시 요청]을 여러 번 눌러 renderedAt이 매번 바뀌는지 확인하세요.
        </div>
      )}
    </div>
  )
}
