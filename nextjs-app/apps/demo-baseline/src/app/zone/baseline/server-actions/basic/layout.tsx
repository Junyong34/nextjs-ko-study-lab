import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'server-actions/basic')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
