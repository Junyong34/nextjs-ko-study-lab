import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getDemoMetadata } from '@study/demos'
import { ZoomCardLab } from './components/ZoomCardLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/view-transitions/zoom-card')

// 전환 기록은 layout에 두어야 목록 → 상세 이동 중에도 유지된다. (enter/exit 애니메이션 자체는 layout이 아닌 page에서 일어난다)
export default function Layout({ children }: { children: ReactNode }) {
  return <ZoomCardLab>{children}</ZoomCardLab>
}
