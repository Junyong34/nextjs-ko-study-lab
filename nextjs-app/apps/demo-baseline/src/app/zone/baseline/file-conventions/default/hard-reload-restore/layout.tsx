import type { ReactNode } from 'react'
import { HardReloadPracticeFrame } from './components/HardReloadPracticeFrame'

export default function Layout({
  children,
  preview,
}: {
  children: ReactNode
  preview: ReactNode
}) {
  return <HardReloadPracticeFrame preview={preview}>{children}</HardReloadPracticeFrame>
}
