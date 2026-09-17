'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { purgeLegacyCacheAction, purgeModernCacheAction } from '../actions'

interface CachedSnapshot {
  productName: string
  price: number
  cacheId: string
  generatedAt: string
}

interface MigrateCacheDemoProps {
  legacy: CachedSnapshot
  modern: CachedSnapshot
}

export function MigrateCacheDemo({ legacy, modern }: MigrateCacheDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => window.location.reload()

  const handlePurgeLegacy = () => {
    startTransition(async () => {
      await purgeLegacyCacheAction()
      router.refresh()
    })
  }

  const handlePurgeModern = () => {
    startTransition(async () => {
      await purgeModernCacheAction()
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-950 p-4 text-white font-mono text-xs space-y-2">
          <div className="text-zinc-400">레거시: unstable_cache</div>
          <div className="text-[11px] text-zinc-500">
            unstable_cache(fn, ['migrate-legacy-product'], {'{ tags: [...] }'})
          </div>
          <div className="pt-1 space-y-1">
            <div>{legacy.productName}</div>
            <div>캐시 ID: <span className="font-bold text-amber-400">#{legacy.cacheId}</span></div>
            <div className="text-zinc-500">{legacy.generatedAt}</div>
          </div>
          <button
            type="button"
            onClick={handlePurgeLegacy}
            disabled={isPending}
            className="mt-1 rounded bg-zinc-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-zinc-600 disabled:opacity-50 cursor-pointer"
          >
            레거시만 무효화 (revalidateTag)
          </button>
        </div>

        <div className="rounded border border-emerald-800 bg-zinc-950 p-4 text-white font-mono text-xs space-y-2">
          <div className="text-emerald-400">모던: 'use cache' (Next 16)</div>
          <div className="text-[11px] text-zinc-500">
            async function getProduct() {'{ "use cache"; cacheTag(...); }'}
          </div>
          <div className="pt-1 space-y-1">
            <div>{modern.productName}</div>
            <div>캐시 ID: <span className="font-bold text-emerald-400">#{modern.cacheId}</span></div>
            <div className="text-zinc-500">{modern.generatedAt}</div>
          </div>
          <button
            type="button"
            onClick={handlePurgeModern}
            disabled={isPending}
            className="mt-1 rounded bg-emerald-800 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
          >
            모던만 무효화 (revalidateTag)
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-[11px] text-zinc-500">
          새로고침을 반복해도 두 캐시 ID가 모두 그대로 유지됩니다. 무효화 후 첫 새로고침에서는 stale-while-revalidate로 이전 캐시 ID가 그대로 보일 수 있고, 다음 새로고침에서 해당 캐시 ID만 바뀝니다.
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending}
          className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          새로고침
        </button>
      </div>
    </div>
  )
}
