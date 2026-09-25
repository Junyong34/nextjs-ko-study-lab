import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getDemoMetadata } from '@study/demos'
import { CatalogFrame } from '../components/CatalogFrame'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/preserving-ui-state/scroll-retention/catalog')

/**
 * 실습용 "진짜 스크롤 문서"의 공유 레이아웃.
 * 부모 데모 페이지는 셸 iframe 높이에 맞춰 늘어나 자체 스크롤이 없으므로(window.scrollY가 항상 0),
 * 이 라우트를 고정 높이 iframe으로 띄워 Next.js가 실제 document 스크롤을 다루게 한다.
 * ?cat=만 바뀌는 이동에서 이 레이아웃은 그대로이고, Page(Server Component)가 새 searchParams로 다시 렌더링된다.
 */
export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <CatalogFrame>{children}</CatalogFrame>
    </Suspense>
  )
}
