'use client'
import React from 'react'
import Link from 'next/link'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { BASE_PATH, PREBUILT_COMBINATIONS, PREBUILT_CATEGORIES } from '../constants'

const ON_DEMAND_VALID_IDS = ['prod-003', 'prod-005', 'prod-007']

const INVALID_COMBINATIONS = [
  { category: 'fashion', id: 'prod-001', reason: 'prod-001은 electronics 상품 — category/id 불일치' },
  { category: 'electronics', id: 'prod-999', reason: '존재하지 않는 상품 id' },
  { category: 'toys', id: 'prod-001', reason: '존재하지 않는 카테고리' },
]

function findProduct(id: string) {
  return MOCK_PRODUCTS.find((product) => product.id === id)
}

export function GenerateStaticParamsMultiDemo() {
  return (
    <div className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">카테고리 상품 카탈로그</h4>
        <p className="text-xs text-zinc-500">
          조합을 클릭하면 <code>shop/[category]/[id]</code> 실제 중첩 동적 라우트로 이동합니다.
        </p>
      </div>

      <section className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            사전 SSG 조합
          </span>
          <span className="text-[11px] text-zinc-500">
            layout+page의 generateStaticParams() 반환 조합 ({PREBUILT_COMBINATIONS.length}개)
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {PREBUILT_COMBINATIONS.map(({ category, id }) => {
            const product = findProduct(id)
            if (!product) return null
            return (
              <Link
                key={`${category}/${id}`}
                href={`${BASE_PATH}/shop/${category}/${id}`}
                className="block rounded border border-emerald-200 bg-emerald-50/50 p-2.5 text-xs hover:border-emerald-400 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                  /{category}/{id}
                </div>
                <div className="mt-0.5 truncate font-medium text-zinc-800 dark:text-zinc-200">{product.name}</div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            유효하지만 온디맨드
          </span>
          <span className="text-[11px] text-zinc-500">
            실제 데이터는 있으나 generateStaticParams() 목록 밖 ({ON_DEMAND_VALID_IDS.length}개)
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {ON_DEMAND_VALID_IDS.map((id) => {
            const product = findProduct(id)
            if (!product) return null
            const categoryPrebuilt = PREBUILT_CATEGORIES.includes(product.category)
            return (
              <Link
                key={id}
                href={`${BASE_PATH}/shop/${product.category}/${id}`}
                className="block rounded border border-amber-200 bg-amber-50/50 p-2.5 text-xs hover:border-amber-400 dark:border-amber-900 dark:bg-amber-950/20"
              >
                <div className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
                  /{product.category}/{id}
                </div>
                <div className="mt-0.5 truncate font-medium text-zinc-800 dark:text-zinc-200">{product.name}</div>
                <div className="mt-0.5 text-[10px] text-zinc-500">
                  {categoryPrebuilt ? '카테고리 사전 SSG · id만 온디맨드' : '카테고리·id 모두 온디맨드'}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-rose-100 px-2 py-0.5 text-[11px] font-mono font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            잘못된 조합 · 실제 404
          </span>
          <span className="text-[11px] text-zinc-500">notFound()로 실제 404 응답 ({INVALID_COMBINATIONS.length}개)</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {INVALID_COMBINATIONS.map(({ category, id, reason }) => (
            <Link
              key={`${category}/${id}`}
              href={`${BASE_PATH}/shop/${category}/${id}`}
              className="block rounded border border-rose-200 bg-rose-50/50 p-2.5 text-xs hover:border-rose-400 dark:border-rose-900 dark:bg-rose-950/20"
            >
              <div className="font-mono text-[10px] text-rose-700 dark:text-rose-400">
                /{category}/{id}
              </div>
              <div className="mt-0.5 text-zinc-600 dark:text-zinc-400">{reason}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
