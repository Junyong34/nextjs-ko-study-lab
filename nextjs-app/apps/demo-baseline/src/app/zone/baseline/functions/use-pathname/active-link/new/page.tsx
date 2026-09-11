import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-pathname/active-link/new')

import React from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { CategoryProductGrid } from '../components/CategoryProductGrid'

const NEW_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.isNew)

export default function NewArrivalsPage() {
  return (
    <CategoryProductGrid
      heading="신상품 (New) — /new"
      description="isNew가 true인 상품만 모았습니다."
      products={NEW_PRODUCTS}
    />
  )
}
