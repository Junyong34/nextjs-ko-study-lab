import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-pathname/active-link')

import React from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { CategoryProductGrid } from './components/CategoryProductGrid'

const FEATURED = MOCK_PRODUCTS.filter((p) => p.isNew || p.isBest).slice(0, 4)

export default function ShopHomePage() {
  return (
    <div className="space-y-3">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          쇼핑몰 홈 (기본 경로 — /active-link)
        </h3>
        <p className="mt-1 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          위 GNB에서 [신상품], [타임특가], [베스트 100], [기획전] 탭을 눌러 실제 서브 라우트로 이동해 보세요.
          usePathname()이 반환하는 값이 즉시 바뀌는 것을 인스펙터에서 확인할 수 있습니다.
        </p>
      </div>
      <CategoryProductGrid
        heading="오늘의 추천 상품"
        description="신상품·베스트 상품 중 일부를 큐레이션했습니다."
        products={FEATURED}
      />
    </div>
  )
}
