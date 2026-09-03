/**
 * SEO 관련 공통 값의 단일 원본입니다.
 * 도메인 변경, 기본 OG 이미지 교체, 크롤링 제외 경로 조정은 이 파일만 고치면
 * robots.ts / sitemap.ts / 루트 layout / 페이지별 metadata / JSON-LD 전체에 반영됩니다.
 */
const FALLBACK_SITE_URL = 'https://learn-nextjs-lab.space'

export const siteConfig = {
  name: 'Next.js 학습 (App Router)',
  shortName: 'Next.js 학습',
  titleTemplate: '%s | Next.js 학습',
  description:
    'Next.js 공식 문서를 바탕으로 만든 한국어 학습 문서와 실행 가능한 실습 예제를 제공합니다.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, ''),
  locale: 'ko_KR',
  ogImage: '/og-image.png',
} as const

/**
 * robots.ts가 참조하는 크롤링 제외 경로입니다.
 * `/zone/*`, `/demo-static/*`는 학습자 URL에서 의도적으로 숨겨진 zone 프록시 경로이며
 * `/demo/[...slug]`가 그 위에 씌우는 뷰어 페이지가 색인 대상입니다 (ADR 0005).
 */
export const disallowedCrawlPaths = ['/zone/', '/demo-static/'] as const

export const ogImageSize = { width: 1200, height: 630 } as const
export const ogImageContentType = 'image/png'

/**
 * 문서/데모 상세 페이지의 동적 OG 이미지 경로입니다. `[...slug]`/`demo/[...slug]`는 catch-all이라
 * 그 안에 `opengraph-image.tsx`를 colocate할 수 없어(Next.js 제약), 제목을 쿼리로 받는
 * 공용 라우트(`/og/route.tsx`) 하나로 대체합니다.
 */
const dynamicOgImageRoute = '/og'

export function buildDynamicOgImageUrl({ title, eyebrow }: { title: string; eyebrow?: string }): string {
  const params = new URLSearchParams({ title })
  if (eyebrow) params.set('eyebrow', eyebrow)
  return `${dynamicOgImageRoute}?${params.toString()}`
}
