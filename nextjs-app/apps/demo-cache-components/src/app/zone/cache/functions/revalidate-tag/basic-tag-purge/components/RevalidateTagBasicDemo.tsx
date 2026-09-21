'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { purgeInventoryTagAction } from '../actions'
import type { InventoryItem, InventoryTagPurgeResult } from '../types'

interface InventoryCacheSnapshot {
  items: InventoryItem[]
  cacheId: string
  generatedAt: string
}

interface RevalidateTagBasicDemoProps {
  cache: InventoryCacheSnapshot
}

export function RevalidateTagBasicDemo({ cache }: RevalidateTagBasicDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [actionResult, setActionResult] = useState<InventoryTagPurgeResult | null>(null)
  const [prevCacheId, setPrevCacheId] = useState<string | null>(null)

  const handlePurge = () => {
    setPrevCacheId(cache.cacheId)
    startTransition(async () => {
      const res = await purgeInventoryTagAction()
      setActionResult(res)
      router.refresh()
    })
  }

  const cacheCaughtUp = prevCacheId !== null && prevCacheId !== cache.cacheId

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">무효화 대상 태그:</span>
          <code className="rounded bg-zinc-200 px-2 py-0.5 font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            basic-tag-purge:inventory
          </code>
        </div>
        <button
          type="button"
          onClick={handlePurge}
          disabled={isPending}
          className="cursor-pointer rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isPending ? '태그 퍼지 중...' : "revalidateTag('inventory', 'max') 실행"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-3.5 font-mono text-xs dark:border-blue-900/50 dark:bg-blue-950/20 space-y-2">
          <div className="font-sans font-bold text-blue-950 dark:text-blue-200">
            ① 캐시된 조회 결과 (page.tsx가 getInventoryCache()로 읽은 값)
          </div>
          <div className="text-zinc-500">cacheId: #{cache.cacheId} · {cache.generatedAt}</div>
          {cache.items.map((item) => (
            <div key={item.sku} className="rounded bg-white/70 p-2 dark:bg-zinc-950/40">
              <div className="font-bold text-zinc-900 dark:text-zinc-100">{item.name}</div>
              <div>재고 {item.stock}개 · {item.lastSync}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3.5 font-mono text-xs dark:border-emerald-900/50 dark:bg-emerald-950/20 space-y-2">
          <div className="font-sans font-bold text-emerald-950 dark:text-emerald-200">
            ② 방금 실행한 액션의 응답 (즉시 반영)
          </div>
          {actionResult ? (
            <>
              <div className="text-zinc-500">버전: {actionResult.versionId} · {actionResult.timestamp}</div>
              {actionResult.items.map((item) => (
                <div key={item.sku} className="rounded bg-white/70 p-2 dark:bg-zinc-950/40">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">{item.name}</div>
                  <div>재고 {item.stock}개 · {item.lastSync}</div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-zinc-500">아직 실행하지 않음</div>
          )}
        </div>
      </div>

      {prevCacheId !== null && (
        <p className="text-[11px] text-zinc-500">
          {cacheCaughtUp
            ? `캐시 조회 결과의 cacheId가 #${prevCacheId} → #${cache.cacheId}로 바뀌었습니다 — revalidateTag 이후 재방문에서 새 값이 반영된 것입니다.`
            : '액션 응답(②)은 이미 최신 재고를 보여주지만, 캐시된 조회(①)는 아직 이전 cacheId입니다. revalidateTag(tag, \'max\')는 stale-while-revalidate이므로 새로고침을 한 번 더 하면 ①도 갱신됩니다.'}
        </p>
      )}

      <div className="flex justify-end pt-1">
        <DemoResetButton label="캐시 상태 초기화" />
      </div>
    </div>
  )
}
