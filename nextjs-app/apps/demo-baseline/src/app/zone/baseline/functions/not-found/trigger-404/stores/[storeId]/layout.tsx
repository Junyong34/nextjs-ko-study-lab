import React from 'react'
import { notFound } from 'next/navigation'
import { STORE_CATALOG } from '../../types'

/**
 * missing-product-404(items/[id]/page.tsx)는 page.tsx에서 notFound()를 호출한다.
 * 이 데모는 같은 세그먼트라도 layout.tsx에서 notFound()를 호출하면 무슨 일이 일어나는지 보여준다:
 * 이 레이아웃이 감싸는 하위 트리(같은 세그먼트의 page.tsx 포함) 전체가 렌더링되지 않고,
 * 같은 폴더의 not-found.tsx로 즉시 대체된다. (루트 app/layout.tsx에서는 notFound()를 호출할 수 없다 —
 * 그 위로는 not-found 바운더리를 세워줄 부모 세그먼트가 없기 때문이다.)
 */
export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params

  if (!STORE_CATALOG[storeId]) {
    notFound()
  }

  return <>{children}</>
}
