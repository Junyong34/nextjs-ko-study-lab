import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'layouts-and-pages/route-groups-layouts/(auth)/login')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
