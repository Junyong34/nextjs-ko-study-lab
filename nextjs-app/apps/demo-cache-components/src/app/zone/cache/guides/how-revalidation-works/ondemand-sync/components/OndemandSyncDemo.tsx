'use client'

import React, { useState, useTransition } from 'react'
import type { TagPurgeResult } from '../types'
import { revalidateProductsTagAction } from '../actions'

interface OndemandSyncDemoProps {
  initialResult: TagPurgeResult
}

export function OndemandSyncDemo({ initialResult }: OndemandSyncDemoProps) {
  const [data, setData] = useState<TagPurgeResult>(initialResult)
  const [isPending, startTransition] = useTransition()

  const handleRevalidate = () => {
    startTransition(async () => {
      const res = await revalidateProductsTagAction()
      setData(res)
    })
  }

  const isFresh = data.status === 'FRESH'

  return (
    <div className="space-y-4">
      {/* 1. 상단 태그 상태 및 무효화 버튼 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">태그 상태:</span>
          <span
            className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${
              isFresh
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
            }`}
          >
            {isFresh ? '캐시 유효 (Fresh)' : '[즉시] revalidateTag 즉시 만료됨 -> 신규 데이터 재계산'}
          </span>
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

      {/* 2. 캐시된 상품 테이블 및 갱신 타임스탬프 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800 font-sans">
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            태그 바인딩 캐시 데이터 (tag: <code>'{data.tag}'</code>)
          </span>
          <span className="text-[11px] text-zinc-400">
            무효화 횟수: {data.purgeCount}회 | 마지막 갱신: {data.purgedAt}
          </span>
        </div>

        <div className="space-y-2">
          {data.products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded bg-zinc-50 p-2.5 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
            >
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{p.name}</span>
                <span className="ml-2 text-[11px] text-zinc-500 font-mono">(ID: {p.id})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{p.price.toLocaleString()}원</span>
                <span className="text-[11px] text-zinc-500">재고: {p.stock}개</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
