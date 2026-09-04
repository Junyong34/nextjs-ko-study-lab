import type { Metadata } from 'next'
import manifestJson from '../demos-manifest.json'
import type { Demo, DemoZone } from './index'

const manifest = manifestJson as Demo[]

export type DemoMetadataZone = Extract<DemoZone, 'baseline' | 'cache'>

export interface DemoMetadataOptions {
  zone: DemoMetadataZone
  routePath: string
  title?: string
  description?: string
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.learn-nextjs-lab.space').replace(/\/$/, '')

/** 모든 앱(shell, demo-baseline, demo-cache-components)이 공유하는 OG/Twitter 관련 상수. 값이 바뀌면 이 파일만 고치면 된다 */
export const locale = 'ko_KR' as const
export const ogImageSize = { width: 1200, height: 630 } as const
export const ogImageContentType = 'image/png' as const

const zoneLabels: Record<DemoMetadataZone, string> = {
  baseline: 'Baseline 데모',
  cache: 'Cache Components 데모',
}

/**
 * 데모 제목을 문구로 렌더링하는 동적 OG 이미지 URL을 만든다.
 * 실제 렌더링은 각 앱이 자기 자신의 `/zone/{zone}/og` 라우트에서 담당한다.
 * shell의 rewrites는 `/zone/:slug/:path*`만 각 zone 앱으로 프록시하므로(prefix 없는
 * `/og`는 shell 자신에게 떨어진다), 반드시 zone 프리픽스를 포함해야 실제로 해당 앱의
 * 라우트에 도달한다 — metadataBase가 상대경로를 절대 URL로 완성해준다.
 */
function buildOgImageUrl(zone: DemoMetadataZone, title: string, eyebrow: string): string {
  const params = new URLSearchParams({ title, eyebrow })
  return `/zone/${zone}/og?${params.toString()}`
}

const demoMap = new Map<string, Demo>()
for (const item of manifest) {
  demoMap.set(`${item.zone}:${item.url}`, item)
}

function resolveDemo(zone: DemoMetadataZone, subpath: string): { demo?: Demo; subsegment?: string } {
  let current = subpath.replace(/^\/+|\/+$/g, '')
  while (current.length > 0) {
    const found = demoMap.get(`${zone}:${current}`)
    if (found) {
      const subsegment = current === subpath ? undefined : subpath.slice(current.length + 1)
      return { demo: found, subsegment }
    }
    const lastSlash = current.lastIndexOf('/')
    if (lastSlash === -1) break
    current = current.substring(0, lastSlash)
  }
  return {}
}

export function getDemoMetadata(
  optionsOrZone: DemoMetadataZone | DemoMetadataOptions,
  subpathParam?: string,
): Metadata {
  const options: DemoMetadataOptions =
    typeof optionsOrZone === 'string'
      ? { zone: optionsOrZone, routePath: subpathParam || '' }
      : optionsOrZone

  const { zone, routePath, title: customTitle, description: customDescription } = options
  const cleanPath = routePath.replace(/^\/+|\/+$/g, '')
  const { demo, subsegment } = resolveDemo(zone, cleanPath)

  let baseTitle = demo?.title || cleanPath
  if (subsegment) {
    baseTitle = `${baseTitle} - ${subsegment}`
  }

  const finalTitle = customTitle || baseTitle
  const finalDescription = customDescription || `${finalTitle} 실습 예제 - Next.js App Router 학습`
  const pageUrl = `${siteUrl}/zone/${zone}/${cleanPath}`
  const ogImageUrl = buildOgImageUrl(zone, finalTitle, zoneLabels[zone])

  return {
    title: finalTitle,
    description: finalDescription,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: pageUrl,
      type: 'website',
      locale,
      images: [
        {
          url: ogImageUrl,
          width: ogImageSize.width,
          height: ogImageSize.height,
          alt: finalTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [ogImageUrl],
    },
  }
}
