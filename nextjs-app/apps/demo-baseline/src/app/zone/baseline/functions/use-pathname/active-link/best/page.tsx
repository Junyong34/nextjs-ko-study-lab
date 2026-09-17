import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-pathname/active-link/best')

import React from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { CategoryProductGrid } from '../components/CategoryProductGrid'

const BEST_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.isBest)

export default function BestPage() {
  return (
    <CategoryProductGrid
      heading="베스트 100 (Best) — /best"
      description="isBest가 true인 상품만 모았습니다."
      products={BEST_PRODUCTS}
    />
  )
}
