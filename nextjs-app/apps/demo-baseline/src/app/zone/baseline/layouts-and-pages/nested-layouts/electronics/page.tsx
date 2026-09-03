import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'layouts-and-pages/nested-layouts/electronics')

import React from 'react'
import { ProductList } from '../components/ProductList'

export default function NestedLayoutsElectronicsPage() {
  return (
    <ProductList
      category="electronics"
      categoryTitle="전자기기 (Tech)"
    />
  )
}
