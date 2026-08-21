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
