'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { executeRevalidatePathAction } from '../actions'
import { VerificationFooter } from './VerificationFooter'

interface RevalidatePathSyncDemoProps {
  renderId: string
  generatedAt: string
}

export function RevalidatePathSyncDemo({ renderId, generatedAt }: RevalidatePathSyncDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [baselineRenderId] = useState(renderId)
  const [purgedAt, setPurgedAt] = useState<string | null>(null)

  const hasRefreshed = renderId !== baselineRenderId

  const handleRevalidate = () => {
    startTransition(async () => {
      const result = await executeRevalidatePathAction()
      setPurgedAt(result.timestamp)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 상단 상태 바 및 액션 버튼 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <span>상태: </span>
          <span className="font-mono text-zinc-900 dark:text-zinc-100">
            {purgedAt ? `[확인] revalidatePath 호출 완료 (${purgedAt})` : '대기 중'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleRevalidate}
          disabled={isPending}
          className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          {isPending ? '캐시 퍼지 중...' : "revalidatePath('/zone/baseline/guides/isr/revalidate-path-sync') 실행"}
        </button>
      </div>

      {/* 2. renderId 대조 */}
      <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800 font-sans">
          <span className="font-bold text-zinc-800 dark:text-zinc-200">이 페이지 세그먼트의 renderId</span>
          <span className="text-[11px] text-zinc-400">export const revalidate = 3600</span>
        </div>
        <div>
          최초 렌더 시 renderId: <span className="text-zinc-500">{baselineRenderId}</span>
        </div>
        <div>
          현재 renderId:{' '}
          <span className={hasRefreshed ? 'font-bold text-emerald-500' : 'font-bold text-zinc-900 dark:text-zinc-100'}>
            {renderId}
          </span>
        </div>
        <div>현재 generatedAt: {generatedAt}</div>
      </div>

      <VerificationFooter
        isMatched={purgedAt ? hasRefreshed : undefined}
        actual={
          purgedAt
            ? `- revalidatePath 호출 시각: ${purgedAt}\n- 최초 renderId: ${baselineRenderId}\n- 현재 renderId: ${renderId}\n- 변경 여부: ${
                hasRefreshed ? '변경됨 (재계산 확인)' : '아직 동일함 (다시 클릭해 보세요)'
              }`
            : undefined
        }
      />
    </div>
  )
}
