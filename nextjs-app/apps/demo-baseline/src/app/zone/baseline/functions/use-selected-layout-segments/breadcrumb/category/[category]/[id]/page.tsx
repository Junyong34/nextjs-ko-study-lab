import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BASE_PATH, getCategoryName, getProductById } from '../../../types'

interface ProductDetailPageProps {
  params: Promise<{ category: string; id: string }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { category, id } = await params
  return getDemoMetadata(
    'baseline',
    `functions/use-selected-layout-segments/breadcrumb/category/${category}/${id}`,
  )
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { category, id } = await params
  const product = getProductById(id)
  if (!product || product.category !== category) notFound()

  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-3.5 text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
      <p className="font-bold text-zinc-900 dark:text-zinc-100">
        {product.name} — /category/{category}/{id} (세그먼트 배열 길이 3)
      </p>
      <p>{product.description}</p>
      <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
        {getCategoryName(category)} · {product.price.toLocaleString()}원 · 재고 {product.stock}개
      </p>
      <Link
        href={`${BASE_PATH}/category/${category}`}
        className="inline-block text-blue-600 hover:underline dark:text-blue-400"
      >
        ← {getCategoryName(category)} 목록으로
      </Link>
    </div>
  )
}
