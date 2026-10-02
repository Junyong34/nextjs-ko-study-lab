import { notFound } from 'next/navigation'
import { PRODUCTS } from '../../lib/products'

// 정적 export에서 동적 경로는 빌드 때 만들 params를 모두 알려 줘야 한다.
// dynamicParams = false는 목록 밖의 id를 404로 처리한다(export에서는 dynamicParams: true를 지원하지 않는다).
export const dynamicParams = false

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }))
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = PRODUCTS.find((item) => item.id === id)
  if (!product) notFound()

  return (
    <div data-screen={`product:${product.id}`} className="space-y-1 rounded border border-zinc-200 p-3 text-xs dark:border-zinc-800">
      <p className="text-[11px] text-zinc-500">products/[id]/page.tsx · params.id = {product.id}</p>
      <h4 className="text-sm font-bold">{product.name}</h4>
      <p>{product.price}</p>
    </div>
  )
}
