import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BASE, STOCK_DELAY_MS, findProduct } from '../../data'
import { LiveStock } from '../../components/LiveStock'
import { ProductSkeleton } from '../../components/ProductSkeleton'

// 상세 라우트: 상품 정보(정적 셸)는 즉시, 재고(동적 데이터)는 Suspense 경계 뒤에서 스트리밍된다.
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = findProduct(id)
  if (!product) notFound()

  return (
    <div className="space-y-3 rounded-md border border-zinc-300 p-4 text-xs dark:border-zinc-700">
      <Link href={BASE} className="text-blue-600 hover:underline dark:text-blue-400">
        ← 상품 목록
      </Link>
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{product.name}</h3>
      <p className="text-zinc-600 dark:text-zinc-400">{product.description}</p>
      <p className="font-mono text-zinc-800 dark:text-zinc-200">{product.price.toLocaleString('ko-KR')}원</p>
      <Suspense fallback={<ProductSkeleton label={`Suspense 경계 (서버 지연 ${STOCK_DELAY_MS}ms)`} />}>
        <LiveStock id={id} />
      </Suspense>
    </div>
  )
}
