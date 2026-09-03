import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'error-handling/segment-error/payment')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
