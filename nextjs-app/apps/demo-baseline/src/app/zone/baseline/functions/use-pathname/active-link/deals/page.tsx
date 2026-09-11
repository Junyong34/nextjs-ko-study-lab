import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-pathname/active-link/deals')

import React from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { CategoryProductGrid } from '../components/CategoryProductGrid'

const DEAL_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.discountRate >= 20)

export default function DealsPage() {
  return (
    <CategoryProductGrid
      heading="타임특가 (Deals) — /deals"
      description="할인율 20% 이상인 상품만 모았습니다."
      products={DEAL_PRODUCTS}
    />
  )
}
