import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/layout/state-preservation')

import React from 'react'
import { ProductCard, MOCK_PRODUCTS } from '@study/demo-kit'
import { CategoryReporter } from './components/CategoryReporter'

const BOOKS = MOCK_PRODUCTS.filter((product) => product.category === 'books')

export default function StatePreservationBooksPage() {
  return (
    <section aria-label="도서 카테고리" className="min-w-0 space-y-3">
      <h3 className="text-sm font-semibold">도서 카테고리</h3>
      <CategoryReporter category="books" />
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        {BOOKS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
