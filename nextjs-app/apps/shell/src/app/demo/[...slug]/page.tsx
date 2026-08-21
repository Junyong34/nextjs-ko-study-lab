import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DemoIframe } from '@study/docs-render'
import { DemoPageHeader } from '@study/ui'
import { getDemos, getDemoByUrl, getManifest, findDocForDemo } from '@/lib/docs'

interface DemoPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams() {
  const demos = getDemos()
  return demos.map((demo) => ({
    slug: demo.url.split('/'),
  }))
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params
  const demo = getDemoByUrl(slug.join('/'))

  if (!demo) {
    return { title: '데모를 찾을 수 없습니다' }
  }

  return {
    title: `${demo.title} - 인터랙티브 데모`,
    description: `${demo.title} 실습 데모 - Next.js App Router 학습`,
  }
}

export default async function DemoStandalonePage({ params }: DemoPageProps) {
  const { slug } = await params
  const demo = getDemoByUrl(slug.join('/'))

  if (!demo) {
    notFound()
  }

  const matchedDoc = findDocForDemo(getManifest(), demo.doc)
  // 학습자 URL에는 zone이 없지만, iframe이 여는 내부 경로에는 있다 (ADR 0005)
  const iframeSrc = `/zone/${demo.zone}/${demo.url}`

  return (
    <div className="space-y-6">
      <DemoPageHeader
        title={demo.title}
        zone={demo.zone}
        status={demo.status}
        url={demo.url}
        docUrl={matchedDoc?.url ?? '/'}
        docTitle={matchedDoc?.title ?? demo.doc}
      />

      <div className="w-full">
        <DemoIframe
          variant="standalone"
          src={iframeSrc}
          label={iframeSrc}
          title={demo.title}
          externalHref={iframeSrc}
          initialHeight={600}
          minHeight={400}
        />
      </div>
    </div>
  )
}
