import React from 'react'
import type { Metadata } from 'next'
import { PlayCircle } from 'lucide-react'
import { DemoIndexStats } from '@study/ui'
import { getDemos, getManifest } from '@/lib/docs'
import { parseDemoIndexQuery, createDemoIndexViewModel } from '@/lib/demo-index'
import { DemoIndexClient } from '@/components/demo/DemoIndexClient'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: '인터랙티브 실습 예제 목록',
  description: 'Next.js App Router 공식 문서와 연결된 실습 예제 목록',
  path: '/demo',
})

interface DemoIndexPageProps {
  searchParams?: Promise<{
    q?: string | string[]
    category?: string | string[]
    page?: string | string[]
  }>
}

export default async function DemoIndexPage({ searchParams }: DemoIndexPageProps) {
  const resolvedSearchParams = (await searchParams) || {}
  const demos = getDemos()
  const manifest = getManifest()

  const query = parseDemoIndexQuery(resolvedSearchParams)
  const viewModel = createDemoIndexViewModel(demos, manifest, query)

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 mb-2">
          <PlayCircle className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Interactive Demos</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          실습 예제
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Next.js App Router의 핵심 기능을 실행 가능한 예제로 직접 확인해 보세요.
        </p>

        <DemoIndexStats totalCount={viewModel.allCount} doneCount={viewModel.allDoneCount} />
      </div>

      <DemoIndexClient viewModel={viewModel} />
    </div>
  )
}
