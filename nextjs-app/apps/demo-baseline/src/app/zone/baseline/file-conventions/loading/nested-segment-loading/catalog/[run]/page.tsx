import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/loading/nested-segment-loading')

import React from 'react'
import Link from 'next/link'
import { connection } from 'next/server'
import { ProductCard, MOCK_PRODUCTS } from '@study/demo-kit'
import { CatalogReadyReporter } from '../../components/CatalogReadyReporter'
import { NESTED_LOADING_BASE_PATH } from '../../types'

const CATALOG_DELAY_MS = 1800

export default async function CatalogRunPage({ params }: { params: Promise<{ run: string }> }) {
  const { run } = await params
  const startedAt = Date.now()

  // 정적 prerender를 중단시키고, 실제 요청 시점에만 아래 코드가 실행되게 한다.
  await connection()
  // 관측 목적의 교육용 지연 — catalog/loading.tsx fallback을 눈으로 확인할 시간을 확보한다.
  await new Promise((resolve) => setTimeout(resolve, CATALOG_DELAY_MS))

  const elapsedMs = Date.now() - startedAt

  return (
    <div className="min-w-0 space-y-3">
      <CatalogReadyReporter runId={run} />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2 text-xs dark:border-zinc-800">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">
          카탈로그 목록 (catalog/[run]/page.tsx, {elapsedMs}ms 지연 완료)
        </span>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">상품을 클릭해 상세로 이동하세요</span>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        {MOCK_PRODUCTS.map((product) => (
          <Link key={product.id} href={`${NESTED_LOADING_BASE_PATH}/catalog/${run}/${product.id}`} className="block">
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  )
}
