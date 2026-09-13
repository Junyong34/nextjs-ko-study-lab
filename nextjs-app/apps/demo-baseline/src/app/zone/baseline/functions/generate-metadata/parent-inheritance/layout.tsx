import type { Metadata } from 'next'
import { siteUrl, locale, ogImageSize } from '@study/demos'
import { BASE_PATH, PARENT_OPEN_GRAPH } from './types'

// 이 세그먼트(및 하위 products/[productId])가 공유하는 "부모 metadata"다.
// products/[productId]/page.tsx의 generateMetadata는 openGraph를 아예 반환하지 않는다 —
// Next.js의 얕은 병합 규칙(같은 키를 정의하지 않으면 가장 가까운 조상의 값을 그대로 상속)에
// 따라 여기서 정의한 openGraph 전체가 그 라우트에 교체 없이 그대로 상속된다.
// 반대로 형제 page.tsx(인덱스)는 getDemoMetadata()에서 자체 openGraph를 반환하므로
// 이 layout의 openGraph는 통째로 교체된다 — VerificationFooter가 두 경우를 실측으로 대조한다.
export const metadata: Metadata = {
  alternates: {
    canonical: `${siteUrl}${BASE_PATH}`,
  },
  openGraph: {
    type: 'website',
    locale,
    siteName: PARENT_OPEN_GRAPH.siteName,
    title: PARENT_OPEN_GRAPH.title,
    description: PARENT_OPEN_GRAPH.description,
    images: [
      {
        url: `/zone/baseline/og?${new URLSearchParams({
          title: PARENT_OPEN_GRAPH.title,
          eyebrow: '부모 layout.tsx 선언값',
        })}`,
        ...ogImageSize,
        alt: PARENT_OPEN_GRAPH.title,
      },
    ],
  },
}

export default function ParentInheritanceLayout({ children }: { children: React.ReactNode }) {
  return children
}
