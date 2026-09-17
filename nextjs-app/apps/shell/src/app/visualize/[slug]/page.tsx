import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { nextjsVisualizeDemos } from '@/components/visualize/data'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  buildBreadcrumbJsonLd,
  buildLearningResourceJsonLd,
} from '@/lib/seo/json-ld'
import { siteConfig } from '@/lib/seo/config'
import { VisualizeDetailViewer } from '@/components/visualize/VisualizeDetailViewer'

interface VisualizeDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return nextjsVisualizeDemos.map((demo) => ({
    slug: demo.key,
  }))
}

export async function generateMetadata({
  params,
}: VisualizeDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const demo = nextjsVisualizeDemos.find((d) => d.key === slug)

  if (!demo) {
    return {
      title: '시각화를 찾을 수 없습니다',
    }
  }

  return buildPageMetadata({
    title: `${demo.title} | Next.js & React 인터랙티브 시각화`,
    description: demo.description,
    path: `/visualize/${slug}`,
    dynamicOgImage: {
      title: demo.title,
      eyebrow: demo.category,
    },
  })
}

export default async function VisualizeDetailPage({
  params,
}: VisualizeDetailPageProps) {
  const { slug } = await params
  const demo = nextjsVisualizeDemos.find((d) => d.key === slug)

  if (!demo) {
    notFound()
  }

  const relatedDemos = nextjsVisualizeDemos.filter(
    (d) => d.group === demo.group && d.key !== demo.key
  )

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: siteConfig.shortName, url: '/' },
    { name: '시각화 갤러리', url: '/visualize' },
    { name: demo.title, url: `/visualize/${slug}` },
  ])

  const resourceJsonLd = buildLearningResourceJsonLd({
    title: `${demo.title} - Next.js & React 시각화 다이어그램`,
    description: demo.description,
    url: `/visualize/${slug}`,
  })

  return (
    <div className="space-y-6">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={resourceJsonLd} />
      <VisualizeDetailViewer demo={demo} relatedDemos={relatedDemos} />
    </div>
  )
}
