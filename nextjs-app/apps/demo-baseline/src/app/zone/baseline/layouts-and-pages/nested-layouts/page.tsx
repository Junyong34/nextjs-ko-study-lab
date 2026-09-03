import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'layouts-and-pages/nested-layouts')

import React from 'react'
import { ProductList } from './components/ProductList'

export default function NestedLayoutsAllPage() {
  return (
    <ProductList
      category="all"
      categoryTitle="전체 카탈로그"
    />
  )
}
