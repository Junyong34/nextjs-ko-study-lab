import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer } from '@study/demo-kit'
import { findProduct, listReviews } from '../lib/catalog'
import { markAfterNotFound, markBeforeNotFound, markRendered } from '../lib/probe-store'
import { PNF_BASE_PATH } from '../types'
import { ReviewEditForm } from './components/ReviewEditForm'

type Props = { params: Promise<{ id: string }> }

/**
 * 호출 지점 ①: generateMetadata
 * 출시 전 초안(draft) 상품은 메타데이터를 만드는 단계에서 notFound()를 던진다.
 * page 본문에는 draft 검사가 없으므로, 이 경로의 404는 오직 generateMetadata가 만든 것이다.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = findProduct(id)

  if (product?.status === 'draft') {
    markBeforeNotFound('metadata:draft', `generateMetadata id=${id}`)
    notFound()
    markAfterNotFound('metadata:draft', `generateMetadata id=${id}`) // 실행되지 않아야 하는 줄
  }

  return getDemoMetadata({
    zone: 'baseline',
    routePath: 'file-conventions/not-found/programmatic-not-found/[id]',
    title: product && product.visibility === 'public' ? `${product.name} - notFound() 트리거` : undefined,
  })
}

/**
 * 호출 지점 ②: page.tsx 본문 (Server Component)
 * - 존재하지 않는 id → notFound()
 * - 존재하지만 비공개(private) → notFound() (403 대신 404로 존재 자체를 숨기는 패턴)
 */
export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = findProduct(id)

  if (!product) {
    markBeforeNotFound('page:missing-id', `page id=${id}`)
    notFound()
    markAfterNotFound('page:missing-id', `page id=${id}`) // 실행되지 않아야 하는 줄
  }

  if (product.visibility === 'private') {
    markBeforeNotFound('page:private', `page id=${id}`)
    notFound()
    markAfterNotFound('page:private', `page id=${id}`) // 실행되지 않아야 하는 줄
  }

  // notFound()의 반환 타입이 never라서 여기서 product는 Product로 좁혀져 있다.
  markRendered('product-page', `page id=${id} (${product.status})`)
  const reviews = listReviews(product.id)

  return (
    <DemoContainer className="space-y-4">
      <section
        data-rendered-route="product-page"
        className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
          <div>
            <p className="font-mono text-[11px] text-zinc-500">{product.id}</p>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{product.name}</h4>
            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{product.price.toLocaleString()}원</p>
          </div>
          <Link
            href={PNF_BASE_PATH}
            className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          >
            ← 실습으로 돌아가기
          </Link>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">리뷰 (하위 세그먼트 reviews/[reviewId])</h5>
          <ul className="flex flex-wrap gap-2 text-xs">
            {reviews.map((r) => (
              <li key={r.id}>
                <Link
                  href={`${PNF_BASE_PATH}/${product.id}/reviews/${r.id}`}
                  prefetch={false}
                  className="block rounded border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 font-mono hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  {r.id} 보기 →
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`${PNF_BASE_PATH}/${product.id}/reviews/R-9`}
                prefetch={false}
                className="block rounded border border-amber-300 bg-amber-50/60 px-2.5 py-1.5 font-mono text-amber-800 hover:border-amber-500 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300"
              >
                R-9 보기 → (없는 리뷰)
              </Link>
            </li>
          </ul>
        </div>

        <ReviewEditForm productId={product.id} reviews={reviews.map((r) => ({ id: r.id, authorId: r.authorId }))} />
      </section>
    </DemoContainer>
  )
}
