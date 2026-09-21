'use client'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { purgeByProductTagAction, purgeByCategoryTagAction, purgeByBrandTagAction } from '../actions'
import { TAGS } from '../tags'

interface ProductCache {
  productName: string
  cacheId: string
  generatedAt: string
}

interface CacheTagMultiBindingDemoProps {
  product: ProductCache
}

type TagKind = 'product' | 'category' | 'brand'

const TAG_LABELS: Record<TagKind, string> = {
  product: `상품 태그 (${TAGS.product})`,
  category: `카테고리 태그 (${TAGS.category})`,
  brand: `브랜드 태그 (${TAGS.brand})`,
}

export function CacheTagMultiBindingDemo({ product }: CacheTagMultiBindingDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [lastPurgedTag, setLastPurgedTag] = useState<TagKind | null>(null)
  const [prevCacheId, setPrevCacheId] = useState<string | null>(null)

  const purge = (kind: TagKind, action: () => Promise<void>) => {
    startTransition(async () => {
      setPrevCacheId(product.cacheId)
      await action()
      setLastPurgedTag(kind)
      router.refresh()
    })
  }

  const cacheChanged = prevCacheId !== null && prevCacheId !== product.cacheId

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="font-bold text-zinc-900 dark:text-zinc-100">{product.productName}</div>
        <div className="mt-1 text-zinc-500">
          바인딩된 태그: {TAGS.product}, {TAGS.category}, {TAGS.brand}
        </div>
        <div className="mt-1">
          cacheId: <span className="font-bold text-emerald-600 dark:text-emerald-400">#{product.cacheId}</span>
        </div>
        <div className="text-zinc-500">{product.generatedAt}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => purge('product', purgeByProductTagAction)}
          disabled={isPending}
          className="cursor-pointer rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          상품 태그로 무효화
        </button>
        <button
          type="button"
          onClick={() => purge('category', purgeByCategoryTagAction)}
          disabled={isPending}
          className="cursor-pointer rounded bg-purple-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          카테고리 태그로 무효화
        </button>
        <button
          type="button"
          onClick={() => purge('brand', purgeByBrandTagAction)}
          disabled={isPending}
          className="cursor-pointer rounded bg-amber-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          브랜드 태그로 무효화
        </button>
      </div>

      {lastPurgedTag && (
        <p className="text-[11px] text-zinc-500">
          마지막 조작: {TAG_LABELS[lastPurgedTag]} 무효화 → {cacheChanged ? `cacheId가 #${prevCacheId} → #${product.cacheId}로 바뀜` : '새로고침 반영 대기 중 (재시도 시 새 cacheId로 갱신됩니다)'}
        </p>
      )}
      <p className="text-[11px] text-zinc-500">
        세 버튼 중 어느 것을 눌러도 같은 상품 캐시가 무효화됩니다. 하나의 캐시 항목이 상품·카테고리·브랜드 태그 3개에 동시에 묶여 있기 때문입니다.
      </p>

      <div className="flex justify-end pt-1">
        <DemoResetButton label="캐시 상태 초기화" />
      </div>
    </div>
  )
}
