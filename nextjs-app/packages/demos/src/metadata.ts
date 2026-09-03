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

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-nextjs-lab.space').replace(/\/$/, '')

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

  return {
    title: finalTitle,
    description: finalDescription,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: ['/og-image.png'],
    },
  }
}
