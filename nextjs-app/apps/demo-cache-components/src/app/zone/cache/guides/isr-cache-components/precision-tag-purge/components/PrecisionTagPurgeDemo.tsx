'use client'
import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { purgeProduct101Action, purgeCategoryElectronicsAction } from '../actions'

interface PrecisionTagPurgeDemoProps {
  product101: { cacheId: string; generatedAt: string }
  product205: { cacheId: string; generatedAt: string }
}

export function PrecisionTagPurgeDemo({ product101, product205 }: PrecisionTagPurgeDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handlePurge101 = () => {
    startTransition(async () => {
      await purgeProduct101Action()
      router.refresh()
    })
  }

  const handlePurgeCategory = () => {
    startTransition(async () => {
      await purgeCategoryElectronicsAction()
      router.refresh()
    })
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono text-xs">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="font-bold text-zinc-900 dark:text-zinc-100">product-101 (태그: product-101, category-electronics)</div>
          <div>cacheId: <span className="text-emerald-600 dark:text-emerald-400 font-bold">#{product101.cacheId}</span></div>
          <div className="text-zinc-500">{product101.generatedAt}</div>
        </div>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="font-bold text-zinc-900 dark:text-zinc-100">product-205 (태그: product-205, category-electronics)</div>
          <div>cacheId: <span className="text-emerald-600 dark:text-emerald-400 font-bold">#{product205.cacheId}</span></div>
          <div className="text-zinc-500">{product205.generatedAt}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={handlePurge101} disabled={isPending} className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50 cursor-pointer">
          101번 상품만 무효화 (revalidateTag('product-101'))
        </button>
        <button type="button" onClick={handlePurgeCategory} disabled={isPending} className="rounded bg-purple-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50 cursor-pointer">
          전자기기 카테고리 무효화 (revalidateTag('category-electronics'))
        </button>
      </div>
      <p className="text-[11px] text-zinc-500">
        101번만 무효화하면 재방문 시 product-101의 cacheId만 바뀌고 product-205는 그대로입니다. 카테고리를 무효화하면 두 cacheId가 모두 바뀝니다.
      </p>
    </div>
  )
}
