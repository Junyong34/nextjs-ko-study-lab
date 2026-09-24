import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { CategoryPage } from '../components/CategoryPage'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/preserving-ui-state/drawer-open/fashion')

export default function FashionCategoryPage() {
  return <CategoryPage category="fashion" label="패션" />
}
