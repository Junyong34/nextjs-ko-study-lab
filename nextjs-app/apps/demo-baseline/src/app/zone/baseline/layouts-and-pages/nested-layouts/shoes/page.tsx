import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'layouts-and-pages/nested-layouts/shoes')

import React from 'react'
import { ProductList } from '../components/ProductList'

export default function NestedLayoutsShoesPage() {
  return (
    <ProductList
      category="shoes"
      categoryTitle="신발 (Shoes)"
    />
  )
}
