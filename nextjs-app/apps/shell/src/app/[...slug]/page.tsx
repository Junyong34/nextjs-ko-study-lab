import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MarkdownRenderer, parseHeadings, isGlossaryDoc } from '@study/docs-render'
import { TableOfContents, ShareButton } from '@study/ui'
import { getManifest, getDocBySlug, getDocContent, getDemos } from '@/lib/docs'
import { LearningCompletionControl } from '@/components/learning-progress/LearningCompletionControl'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbJsonLdFor, buildLearningResourceJsonLd } from '@/lib/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams() {
  const manifest = getManifest()
  return manifest.docs
    .filter((doc) => doc.slug && doc.slug.length > 0)
    .map((doc) => ({
      slug: doc.slug,
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocBySlug(slug)
  if (!doc) {
    return {
      title: '문서를 찾을 수 없습니다',
    }
  }

  return buildPageMetadata({
    title: doc.title,
    description: 'Next.js App Router 한국어 학습 가이드입니다.',
    path: doc.url,
    dynamicOgImage: { title: doc.title },
  })
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  let content = ''
  try {
    content = getDocContent(doc.path)
  } catch (err) {
    console.error(`Failed to read doc file: ${doc.path}`, err)
    notFound()
  }

  const allDemos = getDemos()
  const headings = parseHeadings(content)
  const breadcrumbs = doc.slug ? doc.slug.slice(0, -1).map((s) => s.replace(/-/g, ' ')) : []
  const description = `${doc.title} - Next.js App Router 한국어 학습 가이드`

  return (
    <div className="flex items-start gap-8">
      <JsonLd data={buildBreadcrumbJsonLdFor({ title: doc.title, url: doc.url })} />
      <JsonLd data={buildLearningResourceJsonLd({ title: doc.title, description, url: doc.url })} />
      {/* Main Document Content */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Category / Breadcrumbs & Top-Right Share Button */}
        <div className="flex items-center justify-between gap-4">
          {breadcrumbs.length > 0 ? (
            <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-medium capitalize">
              <span>학습 문서</span>
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  <span>/</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{b}</span>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div />
          )}

          {!(doc.path === 'README.md' || doc.path.endsWith('/README.md')) && (
            <div className="shrink-0">
              <ShareButton
                title={doc.title}
                url={doc.url}
              />
            </div>
          )}
        </div>

        <LearningCompletionControl
          kind="document"
          itemKey={doc.path}
          label="이 문서를 학습 완료로 표시"
        />

        {/* Main Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-a:font-medium prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-900">
          <MarkdownRenderer
            content={content}
            docPath={doc.path}
            demos={allDemos}
          />
        </div>
      </div>

      {/* Right Sticky Table of Contents / Index Map */}
      <TableOfContents headings={headings} isGlossary={isGlossaryDoc(content, headings, doc.path)} />
    </div>
  )
}
