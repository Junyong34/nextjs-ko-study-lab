import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/environment-variables/runtime-env')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
