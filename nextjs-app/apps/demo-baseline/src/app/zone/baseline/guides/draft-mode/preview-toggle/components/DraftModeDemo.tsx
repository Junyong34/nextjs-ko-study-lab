'use client'
import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { enableDraftAction, disableDraftAction } from '../actions'

interface DraftModeDemoProps {
  isDraft: boolean
}

export function DraftModeDemo({ isDraft }: DraftModeDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      if (isDraft) {
        await disableDraftAction()
      } else {
        await enableDraftAction()
      }
      // draftMode() 쿠키가 바뀌었으므로 서버 컴포넌트를 실제로 재요청해 반영한다.
      router.refresh()
    })
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">
          Draft Mode 상태: {isDraft ? '활성화됨 (미공개 초안 모드)' : '정적 캐시 모드'}
        </span>
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className={`rounded px-3 py-1 text-xs font-bold disabled:opacity-50 cursor-pointer ${
            isDraft ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
          }`}
        >
          {isPending ? '전환 중...' : isDraft ? 'Draft Mode 끄기' : 'Draft Mode 켜기'}
        </button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900">
        {isDraft ? (
          <div className="text-purple-600 dark:text-purple-400 font-bold">[미공개 특가 초안] 2026 블랙프라이데이 70% 시크릿 할인 상품 (미발행)</div>
        ) : (
          <div className="text-zinc-500">일반 고객용 공개 상품 목록 서빙 중</div>
        )}
      </div>
    </div>
  )
}
