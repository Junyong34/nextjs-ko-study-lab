'use client'
import React from 'react'
import Link from 'next/link'
import { MOCK_PRODUCTS, ProductCard } from '@study/demo-kit'
import { BASE_PATH, POPULAR_PRODUCT_IDS } from '../constants'

export function ProductCatalog() {
  const popular = MOCK_PRODUCTS.filter((product) => POPULAR_PRODUCT_IDS.includes(product.id))
  const longTail = MOCK_PRODUCTS.filter((product) => !POPULAR_PRODUCT_IDS.includes(product.id))

  return (
    <div className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">상품 카탈로그</h4>
        <p className="text-xs text-zinc-500">
          상품을 클릭하면 <code>products/[productId]</code> 실제 동적 라우트로 이동합니다.
        </p>
      </div>

      <section className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            BEST · 사전 SSG 빌드 대상
          </span>
          <span className="text-[11px] text-zinc-500">generateStaticParams() 반환 목록 ({popular.length}개)</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {popular.map((product) => (
            <Link key={product.id} href={`${BASE_PATH}/products/${product.id}`} className="block">
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            일반 상품 · 온디맨드 생성
          </span>
          <span className="text-[11px] text-zinc-500">generateStaticParams() 목록에 없음 ({longTail.length}개)</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {longTail.map((product) => (
            <Link key={product.id} href={`${BASE_PATH}/products/${product.id}`} className="block">
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
