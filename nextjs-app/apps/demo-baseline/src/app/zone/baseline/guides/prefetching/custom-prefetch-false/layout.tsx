import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/prefetching/custom-prefetch-false')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
