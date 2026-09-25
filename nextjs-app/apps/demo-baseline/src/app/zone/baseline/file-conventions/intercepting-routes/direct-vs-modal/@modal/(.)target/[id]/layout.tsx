import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/intercepting-routes/direct-vs-modal/@modal/(.)target/[id]',
)

export default function InterceptedTargetLayout({ children }: { children: React.ReactNode }) {
  return children
}
