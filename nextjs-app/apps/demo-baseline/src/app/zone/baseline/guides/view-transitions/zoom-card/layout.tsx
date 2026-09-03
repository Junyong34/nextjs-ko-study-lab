import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/view-transitions/zoom-card')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
