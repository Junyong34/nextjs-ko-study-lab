import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductCard } from '@study/demo-kit'
import { BASE, categoryLabel, getProduct, isCategorySlug } from '../../catalog'
import { PageReporter } from '../../components/PageReporter'
import { PropsBlock } from '../../components/PropsBlock'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/layout/dynamic-category-layout/item')

interface ItemPageProps {
  params: Promise<{ category: string; item: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ItemDetailPage({ params, searchParams }: ItemPageProps) {
  const p = await params
  const sp = await searchParams
  if (!isCategorySlug(p.category)) notFound()
  const product = getProduct(p.category, p.item)
  if (!product) notFound()

  const paramsJson = JSON.stringify(p)
  const searchParamsJson = JSON.stringify(sp)

  return (
    <section aria-label={`${product.name} 상세`} className="min-w-0 space-y-3">
      <PageReporter paramsJson={paramsJson} searchParamsJson={searchParamsJson} />
      <PropsBlock
        title="[category]/[item]/page.tsx가 받은 값"
        rows={[
          ['await params', paramsJson],
          ['await searchParams', searchParamsJson],
        ]}
      />
      <Link href={`${BASE}/${p.category}`} className="text-xs font-semibold text-blue-700 underline dark:text-blue-400">
        {categoryLabel(p.category)} 목록으로
      </Link>
      <div className="max-w-sm">
        <ProductCard product={product} />
      </div>
    </section>
  )
}
