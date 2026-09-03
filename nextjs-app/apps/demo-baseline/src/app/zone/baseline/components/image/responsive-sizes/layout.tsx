import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/image/responsive-sizes')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
