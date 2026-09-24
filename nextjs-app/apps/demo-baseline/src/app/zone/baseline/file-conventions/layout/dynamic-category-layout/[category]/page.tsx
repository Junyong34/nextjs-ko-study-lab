import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BASE, categoryLabel, getProducts, isCategorySlug } from '../catalog'
import { PageReporter } from '../components/PageReporter'
import { PropsBlock } from '../components/PropsBlock'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/layout/dynamic-category-layout/category')

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CategoryListPage({ params, searchParams }: CategoryPageProps) {
  const p = await params
  const sp = await searchParams
  if (!isCategorySlug(p.category)) notFound()

  const products = getProducts(p.category)
  const sorted = sp.sort === 'price' ? [...products].sort((a, b) => a.price - b.price) : products
  const paramsJson = JSON.stringify(p)
  const searchParamsJson = JSON.stringify(sp)

  return (
    <section aria-label={`${categoryLabel(p.category)} 목록`} className="min-w-0 space-y-3">
      <PageReporter paramsJson={paramsJson} searchParamsJson={searchParamsJson} />
      <PropsBlock
        title="[category]/page.tsx가 받은 값"
        rows={[
          ['await params', paramsJson],
          ['await searchParams', searchParamsJson],
        ]}
      />
      <h3 className="text-sm font-semibold">
        {categoryLabel(p.category)} 목록 {sp.sort === 'price' ? '(가격 낮은 순)' : ''}
      </h3>
      <ul className="space-y-1.5 text-xs">
        {sorted.map((product) => (
          <li key={product.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <Link href={`${BASE}/${p.category}/${product.id}`} className="font-semibold text-blue-700 underline dark:text-blue-400">
              {product.name}
            </Link>
            <span className="font-mono">{product.price.toLocaleString('ko-KR')}원</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
