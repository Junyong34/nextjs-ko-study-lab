import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/loading/nested-segment-loading')

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { ProductCard, MOCK_PRODUCTS } from '@study/demo-kit'
import { ProductReadyReporter } from '../../../components/ProductReadyReporter'
import { NESTED_LOADING_BASE_PATH } from '../../../types'

const PRODUCT_DELAY_MS = 1600

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ run: string; product: string }>
}) {
  const { run, product: productId } = await params
  const startedAt = Date.now()

  await connection()
  // 관측 목적의 교육용 지연 — [product]/loading.tsx fallback을 눈으로 확인할 시간을 확보한다.
  await new Promise((resolve) => setTimeout(resolve, PRODUCT_DELAY_MS))

  const elapsedMs = Date.now() - startedAt
  const product = MOCK_PRODUCTS.find((p) => p.id === productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-w-0 space-y-3">
      <ProductReadyReporter runId={run} productId={productId} />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2 text-xs dark:border-zinc-800">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">
          상품 상세 (catalog/[run]/[product]/page.tsx, {elapsedMs}ms 지연 완료)
        </span>
        <Link
          href={`${NESTED_LOADING_BASE_PATH}/catalog/${run}`}
          className="rounded bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
        >
          ← 카탈로그 목록으로
        </Link>
      </div>
      <div className="max-w-sm min-w-0">
        <ProductCard product={product} />
      </div>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        태그: {product.tags.join(', ')} · 평점 {product.rating} ({product.reviewCount}건) · 재고 {product.stock}개
      </p>
    </div>
  )
}
