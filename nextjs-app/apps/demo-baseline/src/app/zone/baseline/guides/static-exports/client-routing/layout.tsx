import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getDemoMetadata } from '@study/demos'
import { ClientRoutingLab } from './components/ClientRoutingLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/static-exports/client-routing')

// 레이아웃은 클라이언트 탐색 동안 다시 마운트되지 않는다. 그래서 요청 기록과 측정 상태를 여기서 유지한다.
export default function Layout({ children }: { children: ReactNode }) {
  return <ClientRoutingLab>{children}</ClientRoutingLab>
}
