import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getDemoMetadata } from '@study/demos'
import { PrefetchLab } from './components/PrefetchLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/adopting-partial-prefetching/hover-shell')

// 관측 훅은 layout에 있어야 목록 → 상세 이동 중에도 요청 로그가 유지된다.
export default function Layout({ children }: { children: ReactNode }) {
  return <PrefetchLab>{children}</PrefetchLab>
}
