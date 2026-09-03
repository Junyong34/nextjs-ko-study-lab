import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/css-in-js/style-registry')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
