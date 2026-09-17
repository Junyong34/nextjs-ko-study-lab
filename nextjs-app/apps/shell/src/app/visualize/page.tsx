import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { nextjsVisualizeDemos } from '@/components/visualize/data'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildLearningResourceJsonLd } from '@/lib/seo/json-ld'
import { VisualizeHeader } from '@/components/visualize/VisualizeHeader'
import { VisualizeGalleryClient } from '@/components/visualize/VisualizeGalleryClient'

export const metadata: Metadata = buildPageMetadata({
  title: 'Next.js & React 인터랙티브 아키텍처 시각화 갤러리',
  description:
    'Streaming SSR, Selective Hydration, ISR, Cache Components 등 Next.js와 React의 핵심 런타임 동작을 캔버스에서 직접 살펴보는 시각화',
  path: '/visualize',
  dynamicOgImage: {
    title: 'Next.js & React 인터랙티브 시각화 갤러리',
    eyebrow: 'Interactive Architecture & Canvas Toolkit',
  },
})

export default function VisualizeHubPage() {
  const jsonLd = buildLearningResourceJsonLd({
    title: 'Next.js & React 인터랙티브 아키텍처 시각화 갤러리',
    description:
      'Next.js와 React의 핵심 동작(Streaming, Hydration, Caching, Rendering)을 캔버스로 살펴보는 학습 도구',
    url: '/visualize',
  })

  return (
    <div className="space-y-8">
      <JsonLd data={jsonLd} />
      <VisualizeHeader totalCount={nextjsVisualizeDemos.length} />

      <Suspense
        fallback={
          <div className="py-12 flex justify-center items-center text-zinc-400 text-sm">
            시각화 갤러리를 불러오는 중...
          </div>
        }
      >
        <VisualizeGalleryClient />
      </Suspense>
    </div>
  )
}
