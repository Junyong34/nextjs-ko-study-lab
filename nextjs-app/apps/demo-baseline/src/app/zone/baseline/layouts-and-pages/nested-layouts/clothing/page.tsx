import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'layouts-and-pages/nested-layouts/clothing')

import React from 'react'
import { ProductList } from '../components/ProductList'

export default function NestedLayoutsClothingPage() {
  return (
    <ProductList
      category="clothing"
      categoryTitle="의류 (Clothing)"
    />
  )
}
