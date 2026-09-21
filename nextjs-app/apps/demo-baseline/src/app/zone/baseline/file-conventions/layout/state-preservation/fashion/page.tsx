import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/layout/state-preservation/fashion')

import React from 'react'
import { ProductCard, MOCK_PRODUCTS } from '@study/demo-kit'
import { CategoryReporter } from '../components/CategoryReporter'

const FASHION = MOCK_PRODUCTS.filter((product) => product.category === 'fashion')

export default function StatePreservationFashionPage() {
  return (
    <section aria-label="패션 카테고리" className="min-w-0 space-y-3">
      <h3 className="text-sm font-semibold">패션 카테고리</h3>
      <CategoryReporter category="fashion" />
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        {FASHION.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
