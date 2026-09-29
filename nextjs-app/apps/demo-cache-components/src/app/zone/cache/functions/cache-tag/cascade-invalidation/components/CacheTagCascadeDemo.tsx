'use client'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { purgeCategoryTagAction, purgeProductsTagAction } from '../actions'
import { TAGS } from '../tags'
import type { CategorySummary, ProductListResult } from '../cachedData'

interface CacheTagCascadeDemoProps {
  category: CategorySummary
  productList: ProductListResult
}

type PurgeKind = 'category' | 'products'

export function CacheTagCascadeDemo({ category, productList }: CacheTagCascadeDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [lastPurged, setLastPurged] = useState<PurgeKind | null>(null)
  const [prevCategoryId, setPrevCategoryId] = useState<string | null>(null)
  const [prevProductsId, setPrevProductsId] = useState<string | null>(null)

  const purge = (kind: PurgeKind, action: () => Promise<void>) => {
    startTransition(async () => {
      setPrevCategoryId(category.cacheId)
      setPrevProductsId(productList.cacheId)
      await action()
      setLastPurged(kind)
      router.refresh()
    })
  }

  const categoryChanged = prevCategoryId !== null && prevCategoryId !== category.cacheId
  const productsChanged = prevProductsId !== null && prevProductsId !== productList.cacheId

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="font-bold text-zinc-900 dark:text-zinc-100">{category.categoryName}</div>
        <div className="mt-1 text-zinc-500">태그: {TAGS.category}</div>
        <div className="mt-1">
          category cacheId: <span className="font-bold text-emerald-600 dark:text-emerald-400">#{category.cacheId}</span>
        </div>
        <div className="text-zinc-500">{category.generatedAt}</div>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="font-bold text-zinc-900 dark:text-zinc-100">상품 목록 ({productList.products.length}개)</div>
        <div className="mt-1 text-zinc-500">태그: {TAGS.category}, {TAGS.products}</div>
        <ul className="mt-1 list-inside list-disc text-zinc-600 dark:text-zinc-400">
          {productList.products.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <div className="mt-1">
          products cacheId: <span className="font-bold text-emerald-600 dark:text-emerald-400">#{productList.cacheId}</span>
        </div>
        <div className="text-zinc-500">{productList.generatedAt}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => purge('category', purgeCategoryTagAction)}
          disabled={isPending}
          className="cursor-pointer rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          카테고리 태그로 무효화 (연쇄)
        </button>
        <button
          type="button"
          onClick={() => purge('products', purgeProductsTagAction)}
          disabled={isPending}
          className="cursor-pointer rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          상품 태그로만 무효화 (비연쇄)
        </button>
      </div>

      {lastPurged && (
        <p className="text-[11px] text-zinc-500">
          마지막 조작: {lastPurged === 'category' ? '카테고리 태그' : '상품 태그'} 무효화 →{' '}
          category {categoryChanged ? `#${prevCategoryId} → #${category.cacheId} 변경` : '변화 없음'},{' '}
          products {productsChanged ? `#${prevProductsId} → #${productList.cacheId} 변경` : '변화 없음'}
          {!categoryChanged && !productsChanged && ' (새로고침 반영 대기 중이면 한 번 더 조작해 확인하세요)'}
        </p>
      )}
      <p className="text-[11px] text-zinc-500">
        카테고리 태그를 무효화하면 두 캐시 항목이 모두 이 태그를 공유하므로 cacheId가 함께 바뀝니다. 상품 태그만 무효화하면 products cacheId만 바뀌고 category cacheId는 그대로입니다.
      </p>

      <div className="flex justify-end pt-1">
        <DemoResetButton label="캐시 상태 초기화" />
      </div>
    </div>
  )
}
