import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { ViewportFrame } from '../components/ViewportFrame'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/link/soft-navigation-scroll/viewport')

/**
 * 실습용 "진짜 스크롤 문서"의 공유 레이아웃.
 * 부모 데모 페이지는 셸 iframe 높이에 맞춰 늘어나 자체 스크롤이 없으므로(window.scrollY가 항상 0),
 * 이 라우트를 고정 높이 iframe으로 띄워 Next.js가 실제 document 스크롤을 다루게 한다.
 * viewport/1 ↔ viewport/2 이동 시 이 레이아웃은 유지되고 Page 세그먼트만 교체된다.
 */
export default function ViewportLayout({ children }: { children: React.ReactNode }) {
  return <ViewportFrame>{children}</ViewportFrame>
}
