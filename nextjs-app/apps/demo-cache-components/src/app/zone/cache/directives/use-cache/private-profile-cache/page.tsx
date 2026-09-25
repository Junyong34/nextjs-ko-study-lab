import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/private-profile-cache')

import { Suspense } from 'react'
import { PanelSkeleton, PrivateOrdersPanel } from './components/PrivateOrdersPanel'

// 이 세그먼트만 Partial Prefetching을 켠다 (next.config 수정 없음).
// <Link>가 받아 가는 App Shell에 'use cache: private' 결과가 포함되어 브라우저 메모리에 보관된다.
export const prefetch = 'partial'

/** 주문 내역 탭 */
export default function OrdersPage() {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <PrivateOrdersPanel route="orders" />
    </Suspense>
  )
}
