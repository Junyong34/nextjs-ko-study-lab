import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MarkdownRenderer, parseHeadings, isGlossaryDoc } from '@study/docs-render'
import { TableOfContents } from '@study/ui'
import { getManifest, getDocBySlug, getDocContent, getDemos } from '@/lib/docs'

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

  return {
    title: doc.title,
    description: `${doc.title} - Next.js App Router 공식 문서 한국어 가이드`,
  }
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

  return (
    <div className="flex items-start gap-8">
      {/* Main Document Content */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Category / Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-medium capitalize">
            <span>학습 문서</span>
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                <span>/</span>
                <span className="text-zinc-600 dark:text-zinc-400">{b}</span>
              </React.Fragment>
            ))}
          </div>
        )}

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
