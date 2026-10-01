import { notFound } from 'next/navigation'
import { CATALOG, PREBUILT_IDS } from '../../lib/catalog'

// 이 목록에 없는 id는 요청 시점에 만들지 않고 404로 응답한다.
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams
export const dynamicParams = false

// next build가 이 함수를 호출해 반환된 id마다 HTML을 한 번씩 렌더링한다.
export function generateStaticParams() {
  return PREBUILT_IDS.map((id) => ({ id }))
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = CATALOG.find((p) => p.id === id)
  if (!product) notFound()

  // 요청 API(cookies/headers/searchParams)를 쓰지 않으므로 production에서는 빌드 때 한 번 실행된 값이 HTML에 고정된다.
  // next dev는 사전 렌더링 캐시를 쓰지 않아 요청마다 이 값이 새로 계산된다.
  const renderedAt = new Date().toISOString()

  return (
    <main className="mx-auto max-w-md p-6 text-sm">
      <article
        data-product-id={product.id}
        data-rendered-at={renderedAt}
        data-node-env={process.env.NODE_ENV}
        className="space-y-2 rounded-lg border border-zinc-300 p-5 dark:border-zinc-700"
      >
        <p className="font-mono text-xs text-zinc-500">PROD-{product.id}</p>
        <h1 className="text-lg font-bold">{product.name}</h1>
        <p>KRW {product.price.toLocaleString('ko-KR')}</p>
        <p className="border-t pt-2 font-mono text-xs text-zinc-500 dark:border-zinc-800">
          rendered at {renderedAt} · NODE_ENV {process.env.NODE_ENV}
        </p>
      </article>
    </main>
  )
}
