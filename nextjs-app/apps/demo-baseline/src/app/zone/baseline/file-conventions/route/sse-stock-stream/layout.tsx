import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route/sse-stock-stream')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
