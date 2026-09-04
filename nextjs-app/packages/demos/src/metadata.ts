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
 * 데모 URL 첫 세그먼트(카테고리) → 사람이 읽는 라벨. zone마다 별도로 관리한다 — 같은 slug라도
 * zone에 따라 뜻이 다르다(예: `config`가 baseline에선 "환경 설정", cache에선 "캐시 설정").
 * 각 zone의 카탈로그 루트 페이지(apps 하위 각 zone의 src/app/page.tsx)와 getDemoMetadata()의
 * OG description이 공유하는 단일 원본이다.
 */
export const categoryLabels: Record<DemoMetadataZone, Record<string, string>> = {
  baseline: {
    architecture: 'Architecture (아키텍처)',
    components: 'Components (내장 컴포넌트)',
    config: 'Configuration (환경 설정)',
    css: 'CSS & 스타일링',
    directives: 'Directives (지시어)',
    edge: 'Edge Runtime',
    'error-handling': 'Error Handling (오류 처리)',
    'fetching-data': 'Data Fetching (데이터 조회)',
    'file-conventions': 'File Conventions (특수 파일 규약)',
    fonts: 'Font Optimization (폰트)',
    functions: 'Functions & Hooks (App Router 함수)',
    guides: 'Guides (실무 가이드)',
    images: 'Image Optimization (이미지)',
    'layouts-and-pages': 'Layouts & Pages (레이아웃 & 페이지)',
    'linking-and-navigating': 'Linking & Navigating (링크 & 내비게이션)',
    'metadata-and-og-images': 'Metadata & Open Graph',
    'mutating-data': 'Mutating Data (데이터 변형)',
    proxy: 'Proxy & Rewrites (프록시 & 리라이트)',
    'route-handlers': 'Route Handlers (라우트 핸들러)',
    'server-actions': 'Server Actions (서버 액션)',
    'server-client-components': 'Server & Client Components',
  },
  cache: {
    caching: 'Caching (캐싱 기본)',
    config: 'Configuration (캐시 설정)',
    directives: 'Directives (`use cache` 지시어)',
    functions: 'Functions (캐시 함수 및 수명 주기)',
    guides: 'Guides (인증, 마이그레이션, ISR 실무)',
    revalidating: 'Revalidation (온디맨드 & 시간 기반 재검증)',
  },
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
  const categorySlug = cleanPath.split('/')[0]
  const categoryLabel = categoryLabels[zone][categorySlug] ?? zoneLabels[zone]
  const finalDescription =
    customDescription || `${categoryLabel} 카테고리의 실습 예제입니다. 브라우저에서 직접 동작을 확인해보세요.`
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
