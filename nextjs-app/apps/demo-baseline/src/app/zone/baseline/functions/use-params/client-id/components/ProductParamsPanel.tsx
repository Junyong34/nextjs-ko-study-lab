'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { MOCK_PRODUCTS, ProductCard } from '@study/demo-kit'

/**
 * [category]/[id]/page.tsx는 이 컴포넌트에 category/id를 props로 내려주지 않는다.
 * 이 컴포넌트가 직접 useParams()를 호출해 현재 라우트의 다이나믹 세그먼트 값을 읽는다 —
 * Props Drilling 없이 깊은 계층의 Client Component가 라우트 파라미터에 접근하는 사례.
 */
export function ProductParamsPanel() {
  const params = useParams<{ category: string; id: string }>()
  const product = MOCK_PRODUCTS.find(
    (item) => item.category === params.category && item.id === params.id,
  )

  return (
    <div className="space-y-3">
      <div className="rounded bg-zinc-950 px-3.5 py-2 font-mono text-[11px] text-zinc-300">
        const {'{'} category, id {'}'} = useParams() → category: &quot;{params.category}&quot;, id: &quot;
        {params.id}&quot;
      </div>

      {product ? (
        <ProductCard product={product} />
      ) : (
        <div className="rounded border border-amber-300 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          &quot;{params.category}/{params.id}&quot;에 해당하는 상품을 찾을 수 없습니다. useParams()는 URL
          세그먼트 문자열({params.category}, {params.id})을 정상적으로 읽어왔지만, 그 값과 일치하는 데이터가
          있는지는 애플리케이션이 직접 검증해야 합니다.
        </div>
      )}
    </div>
  )
}
