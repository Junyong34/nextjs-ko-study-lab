import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@study/demo-kit'
import { BASE_PATH, getCategoryName, getProductsByCategory } from '../../types'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  return getDemoMetadata(
    'baseline',
    `functions/use-selected-layout-segments/breadcrumb/category/${category}`,
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const products = getProductsByCategory(category)
  if (products.length === 0) notFound()

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        {getCategoryName(category)} 카테고리 상품 목록 — /category/{category} (세그먼트 배열 길이 2)
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <Link key={product.id} href={`${BASE_PATH}/category/${category}/${product.id}`} className="block">
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  )
}
