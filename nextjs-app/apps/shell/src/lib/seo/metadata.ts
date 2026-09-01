import type { Metadata } from 'next'
import { buildDynamicOgImageUrl, ogImageSize, siteConfig } from './config'

interface PageMetadataInput {
  title: string
  description: string
  /** 이 페이지의 경로 (canonical/OG url 계산에 쓰임). `metadataBase`가 상대경로를 절대 URL로 완성한다 */
  path: string
  /** 검색엔진 색인에서 제외할 페이지(예: 개인 학습 기록 대시보드)에만 true로 설정 */
  noIndex?: boolean
  /** 문서/데모 상세처럼 제목 기반 OG 이미지가 필요하면 지정 — 기본 og-image.png 대신 `/og` 라우트로 렌더링됨 */
  dynamicOgImage?: { title: string; eyebrow?: string }
}

/**
 * 모든 페이지가 이 함수 하나로 title/description/canonical/OG/Twitter를 채웁니다.
 * 도메인이나 기본 OG 이미지가 바뀌어도 각 page.tsx를 건드릴 필요 없이 config.ts만 고치면 됩니다.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  noIndex,
  dynamicOgImage,
}: PageMetadataInput): Metadata {
  const image = dynamicOgImage
    ? { url: buildDynamicOgImageUrl(dynamicOgImage), width: ogImageSize.width, height: ogImageSize.height }
    : { url: siteConfig.ogImage, width: ogImageSize.width, height: ogImageSize.height }

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.shortName,
      locale: siteConfig.locale,
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}
