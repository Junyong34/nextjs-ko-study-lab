import { MOCK_PRODUCTS, ProductCard } from '@study/demo-kit'

// 이 라우트를 의도적으로 "동적 라우트"로 고정한다.
// prefetch="auto"(기본값)와 prefetch={true}(full)의 차이는 정적 라우트에서는 드러나지 않고
// (둘 다 전체 prefetch) 동적 라우트에서만 관찰할 수 있다 — 공식 문서 Link#prefetch 참고.
export const dynamic = 'force-dynamic'

const LIVE_PRODUCT_COUNT = 6

export default async function PrefetchTargetPage({
  params,
}: {
  params: Promise<{ variant: string }>
}) {
  const { variant } = await params

  // 요청마다 새로 계산되는 값 — 정적으로 캐시된 페이로드가 아니라
  // 서버가 실제로 이 요청을 렌더링했다는 것을 눈으로 확인시켜준다.
  const checkedAt = new Date().toLocaleTimeString('ko-KR', { hour12: false })
  const liveProducts = MOCK_PRODUCTS.slice(0, LIVE_PRODUCT_COUNT).map((product) => ({
    ...product,
    stock: Math.floor(Math.random() * 40) + 1,
  }))

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6 font-sans">
      <div className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
        <code>prefetch=&quot;{variant}&quot;</code> 링크로 진입 · 실시간 재고 확인 시각 {checkedAt} (요청마다 재계산됨)
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {liveProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <a
        href="/zone/baseline/components/link/prefetch-options"
        className="inline-block text-xs font-medium text-blue-600 underline dark:text-blue-400"
      >
        ← 실습 페이지로 돌아가기
      </a>
    </div>
  )
}
