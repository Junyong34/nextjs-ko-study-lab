import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-pathname/active-link/events')

import React from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { CategoryProductGrid } from '../components/CategoryProductGrid'

const EVENT_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.stock > 0 && p.stock <= 20)

export default function EventsPage() {
  return (
    <CategoryProductGrid
      heading="기획전 (Events) — /events"
      description="재고가 20개 이하로 남은 '긴급 재입고 임박' 한정 수량 상품만 모았습니다."
      products={EVENT_PRODUCTS}
    />
  )
}
