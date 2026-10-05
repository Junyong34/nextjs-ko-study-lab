import type { RouteSpec } from './types'

export const BASE_PATH = '/zone/baseline/file-conventions/dynamic-segments/static-or-dynamic'

/** generateStaticParams가 반환하는 값 (with-gsp/[slug]/page.tsx와 같은 목록) */
export const PRERENDERED_SLUGS = ['alpha', 'beta'] as const

/**
 * 대조할 라우트. 네 라우트 모두 같은 RenderStamp를 그리고, 차이는 [slug] 폴더의 조건뿐이다.
 * expectedSymbol·prodUniqueIds는 production(next build && next start)에서 실측해 확정한 값이다.
 */
export const ROUTES: RouteSpec[] = [
  {
    key: 'no-gsp',
    path: 'no-gsp/alpha',
    file: 'no-gsp/[slug]/page.tsx',
    condition: '[slug]만 있고 generateStaticParams 없음',
    expectedSymbol: 'ƒ',
    prodUniqueIds: 'all',
  },
  {
    key: 'with-gsp-listed',
    path: 'with-gsp/alpha',
    file: 'with-gsp/[slug]/page.tsx',
    condition: 'generateStaticParams 목록 안의 값 (alpha)',
    expectedSymbol: '●',
    prodUniqueIds: 1,
  },
  {
    key: 'with-gsp-unlisted',
    path: 'with-gsp/zeta',
    file: 'with-gsp/[slug]/page.tsx',
    condition: 'generateStaticParams 목록 밖의 값 (zeta)',
    expectedSymbol: '●',
    prodUniqueIds: 1,
  },
  {
    key: 'with-headers',
    path: 'with-headers/alpha',
    file: 'with-headers/[slug]/page.tsx',
    condition: 'generateStaticParams 있음 + 본문에서 await headers()',
    expectedSymbol: 'ƒ',
    prodUniqueIds: 'all',
  },
]

export const routeHref = (route: RouteSpec) => `${BASE_PATH}/${route.path}`

export const SAMPLES_PER_ROUTE = 3
