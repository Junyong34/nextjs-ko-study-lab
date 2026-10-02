import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { ProductFeed } from './components/ProductFeed'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/tanstack-query/infinite-scroll')

// 가이드·검증·개념 정리는 layout.tsx가 그린다. 이 페이지는 목록만 가지며, notice/로 이동하면 언마운트된다.
export default function DemoPage() {
  return <ProductFeed />
}
