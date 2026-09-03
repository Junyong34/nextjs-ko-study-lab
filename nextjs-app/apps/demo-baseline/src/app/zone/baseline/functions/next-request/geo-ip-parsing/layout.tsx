import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/next-request/geo-ip-parsing')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
