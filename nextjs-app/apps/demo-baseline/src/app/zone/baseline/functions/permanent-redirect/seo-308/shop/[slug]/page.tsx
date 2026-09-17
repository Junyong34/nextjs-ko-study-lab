import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/permanent-redirect/seo-308/shop')

import React from 'react'
import Link from 'next/link'
import { DemoContainer, ExpectedActualPanel } from '@study/demo-kit'
import { PRODUCTS_BY_SLUG } from '../../types'

const DEMO_BASE = '/zone/baseline/functions/permanent-redirect/seo-308'

export default async function ShopProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ via?: string }>
}) {
  const { slug } = await params
  const { via } = await searchParams
  const product = PRODUCTS_BY_SLUG[slug]
  const isPermanent = via === 'permanent'
  const isTemporary = via === 'temporary'

  return (
    <DemoContainer className="space-y-6">
      <div className="rounded-lg border border-emerald-300 bg-emerald-50/60 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          {isPermanent
            ? '308 Permanent Redirect로 도착한 신규 표준 URL'
            : isTemporary
              ? '307 Temporary Redirect로 도착한 임시 목적지'
              : '직접 접근한 신규 URL'}
        </p>
        <h1 className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {product ? product.name : '알 수 없는 상품'}
        </h1>
        {product && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{product.price.toLocaleString()}원</p>
        )}
        <p className="mt-3 font-mono text-[11px] text-zinc-500">
          {DEMO_BASE}/shop/{slug}
        </p>
      </div>

      <ExpectedActualPanel
        title="레거시 URL → 신규 URL 리다이렉트 도착 검증"
        expected={
          isPermanent
            ? 'permanentRedirect() 호출로 HTTP 308 응답을 받아 이 신규 URL에 영구 도착한다.'
            : 'redirect() 호출로 HTTP 307 응답을 받아 이 URL에 임시 도착한다 (검색엔진은 원래 URL 색인을 유지).'
        }
        actual={`- 현재 경로: ${DEMO_BASE}/shop/${slug}\n- via 파라미터: ${via ?? '(없음, 직접 접근)'}\n- 이 페이지가 렌더링됐다는 사실 자체가 리다이렉트가 실제로 발생했다는 증거`}
        isMatched={Boolean(product) && (isPermanent || isTemporary)}
      />

      <Link
        href={DEMO_BASE}
        className="inline-block text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
      >
        ← 실습 화면으로 돌아가기
      </Link>
    </DemoContainer>
  )
}
