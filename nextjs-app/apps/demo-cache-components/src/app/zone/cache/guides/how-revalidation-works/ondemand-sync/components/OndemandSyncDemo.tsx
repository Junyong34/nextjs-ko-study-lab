'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { StoredProduct } from '../store'
import { revalidateProductsTagAction } from '../actions'

interface OndemandSyncDemoProps {
  cacheId: string
  generatedAt: string
  products: StoredProduct[]
}

export function OndemandSyncDemo({ cacheId, generatedAt, products }: OndemandSyncDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRevalidate = () => {
    startTransition(async () => {
      await revalidateProductsTagAction()
      // 'use cache' 함수는 서버 컴포넌트가 재요청될 때만 다시 계산되므로 router.refresh()로 재요청한다.
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          캐시 ID: <code className="font-mono text-zinc-900 dark:text-zinc-100">#{cacheId}</code> · 생성 시각: {generatedAt}
        </div>
        <button
          type="button"
          onClick={handleRevalidate}
          disabled={isPending}
          className="rounded bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? '태그 무효화 중...' : 'revalidateTag("products") 즉시 무효화'}
        </button>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded bg-zinc-50 p-2.5 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{p.name}</span>
            <span>{p.price.toLocaleString()}원 · 재고 {p.stock}개</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-zinc-500">
        버튼 클릭 후 첫 새로고침에서는 stale-while-revalidate로 이전 캐시 ID가 그대로 보일 수 있고, 다음 재방문에서 새 캐시 ID로 바뀝니다(B01 caching/basic과 동일한 실제 동작).
      </p>
    </div>
  )
}
