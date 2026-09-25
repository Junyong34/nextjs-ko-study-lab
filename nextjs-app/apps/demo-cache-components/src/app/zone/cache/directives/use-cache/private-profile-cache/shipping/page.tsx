import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/private-profile-cache')

import { Suspense } from 'react'
import { PanelSkeleton, PrivateOrdersPanel } from '../components/PrivateOrdersPanel'

export const prefetch = 'partial'

/** 배송 조회 탭: 같은 'use cache: private' 함수를 호출하는 두 번째 서브 라우트 */
export default function ShippingPage() {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <PrivateOrdersPanel route="shipping" />
    </Suspense>
  )
}
