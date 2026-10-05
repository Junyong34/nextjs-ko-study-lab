import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { LinkGrid } from './components/LinkGrid'

export const metadata: Metadata = getDemoMetadata('cache', 'guides/adopting-partial-prefetching/app-shell')

export default function AppShellListPage() {
  return <LinkGrid />
}
