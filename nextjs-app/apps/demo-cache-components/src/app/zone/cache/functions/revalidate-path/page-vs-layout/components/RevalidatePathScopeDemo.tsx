'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DemoResetButton } from '@study/demo-kit'
import { executeScopeRevalidateAction } from '../actions'
import { SAMPLE_ITEM_ID, SAMPLE_CATEGORY_SLUG } from '../paths'

interface RevalidatePathScopeDemoProps {
  hub: { cacheId: string; generatedAt: string }
}

export function RevalidatePathScopeDemo({ hub }: RevalidatePathScopeDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [lastScope, setLastScope] = useState<'page' | 'layout' | null>(null)
  const [prevHubCacheId, setPrevHubCacheId] = useState<string | null>(null)

  const runScope = (scope: 'page' | 'layout') => {
    setPrevHubCacheId(hub.cacheId)
    startTransition(async () => {
      await executeScopeRevalidateAction(scope)
      setLastScope(scope)
      router.refresh()
    })
  }

  const hubChanged = prevHubCacheId !== null && prevHubCacheId !== hub.cacheId

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="font-sans font-bold text-zinc-900 dark:text-zinc-100">허브 페이지 (이 페이지 자신)</div>
        <div>hub cacheId: <span className="font-bold text-emerald-600 dark:text-emerald-400">#{hub.cacheId}</span></div>
        <div className="text-zinc-500">{hub.generatedAt}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => runScope('page')}
          disabled={isPending}
          className="cursor-pointer rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          'page' 스코프로 무효화 (허브만)
        </button>
        <button
          type="button"
          onClick={() => runScope('layout')}
          disabled={isPending}
          className="cursor-pointer rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          'layout' 스코프로 무효화 (허브+하위 전체)
        </button>
      </div>

      {lastScope && (
        <p className="text-[11px] text-zinc-500">
          방금 <code>revalidatePath(path, '{lastScope}')</code> 실행됨 →{' '}
          {hubChanged ? `허브 cacheId가 #${prevHubCacheId} → #${hub.cacheId}로 바뀜.` : '새로고침 반영 대기 중.'}{' '}
          {lastScope === 'page'
            ? '이 스코프는 허브 자신만 무효화합니다 — 아래 상품/카테고리 링크로 이동해도 cacheId가 그대로인지 확인해 보세요.'
            : '이 스코프는 공유 layout.tsx와 그 아래 모든 페이지를 무효화합니다 — 아래 상품/카테고리 링크로 이동하면 cacheId와 layout 배너가 모두 바뀌어 있어야 합니다.'}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800">
        <Link href={`/zone/cache/functions/revalidate-path/page-vs-layout/items/${SAMPLE_ITEM_ID}`} className="text-blue-700 underline dark:text-blue-300">
          → 상품 상세로 이동 (items/{SAMPLE_ITEM_ID})
        </Link>
        <Link href={`/zone/cache/functions/revalidate-path/page-vs-layout/category/${SAMPLE_CATEGORY_SLUG}`} className="text-purple-700 underline dark:text-purple-300">
          → 카테고리 피드로 이동 (category/{SAMPLE_CATEGORY_SLUG})
        </Link>
      </div>

      <div className="flex justify-end pt-1">
        <DemoResetButton label="캐시 상태 초기화" />
      </div>
    </div>
  )
}
