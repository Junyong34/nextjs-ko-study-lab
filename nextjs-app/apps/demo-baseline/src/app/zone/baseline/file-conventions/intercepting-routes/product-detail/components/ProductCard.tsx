'use client'

import React from 'react'
import Link from 'next/link'
import { BASE_PATH, NO_SEED_ID } from '../constants'
import type { ProductSummary } from '../types'
import { useSetProductSeed } from './ProductSeedProvider'

/** 목록 카드. 소프트 내비게이션 링크를 누르는 순간 이 카드의 요약을 Context에 담는다. */
export function ProductCard({ summary }: { summary: ProductSummary }) {
  const setSeed = useSetProductSeed()
  const href = `${BASE_PATH}/products/${summary.id}`

  return (
    <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="space-y-2">
        <div
          className={`flex h-20 items-center justify-center rounded-md bg-gradient-to-br p-2 text-center text-xs font-bold text-white ${summary.color}`}
        >
          {summary.name}
        </div>
        <div>
          <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{summary.name}</h5>
          <p className="text-[11px] text-zinc-500">{summary.category}</p>
        </div>
        <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
          {summary.price.toLocaleString()}원
        </span>
      </div>

      <div className="mt-3 space-y-1.5 border-t border-zinc-200 pt-2.5 dark:border-zinc-800">
        <Link
          href={href}
          onClick={() => setSeed(summary)}
          className="block rounded bg-indigo-600 px-2.5 py-1.5 text-center text-[11px] font-semibold text-white hover:bg-indigo-700"
        >
          앱 안에서 이동 (소프트 내비게이션)
        </Link>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-center text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          새 탭에서 직접 진입 (하드 내비게이션)
        </a>
      </div>
    </div>
  )
}

/** 목록에 요약이 없는 상품으로 가는 링크 — 요약(seed)을 비우고 이동한다. */
export function NoSeedLink() {
  const setSeed = useSetProductSeed()
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 p-3.5 text-xs dark:border-zinc-700">
      <p className="text-zinc-600 dark:text-zinc-400">
        목록에 요약이 없는 상품(#{NO_SEED_ID})입니다. 모달이 보여 줄 요약이 없으면 어떻게 열리는지 확인합니다.
      </p>
      <Link
        href={`${BASE_PATH}/products/${NO_SEED_ID}`}
        onClick={() => setSeed(null)}
        className="mt-2 inline-block rounded bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
      >
        요약 없는 상품 #{NO_SEED_ID} 열기 (소프트 내비게이션)
      </Link>
    </div>
  )
}
