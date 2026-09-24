import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { CategoryPage } from './components/CategoryPage'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/preserving-ui-state/drawer-open')

export default function ElectronicsCategoryPage() {
  return <CategoryPage category="electronics" label="전자기기" />
}
