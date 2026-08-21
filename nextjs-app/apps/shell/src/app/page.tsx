import React from 'react'
import type { Metadata } from 'next'
import { MarkdownRenderer, TableOfContents } from '@study/docs-render'
import { getDocContent, getDemos } from '@/lib/docs'

export const metadata: Metadata = {
  title: 'Next.js App Router 학습',
  description: 'Next.js 공식 문서 한국어 번역 및 데모 실습 랩',
}

export default function HomePage() {
  const content = getDocContent('README.md')
  const allDemos = getDemos()

  return (
    <div className="flex items-start gap-8">
      <div className="min-w-0 flex-1 prose prose-zinc dark:prose-invert max-w-none">
        <MarkdownRenderer
          content={content}
          docPath="README.md"
          demos={allDemos}
        />
      </div>
      <TableOfContents content={content} docPath="README.md" />
    </div>
  )
}
