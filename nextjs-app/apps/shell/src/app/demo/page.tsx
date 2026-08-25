import React from 'react'
import type { Metadata } from 'next'
import { PlayCircle } from 'lucide-react'
import { DemoIndexStats } from '@study/ui'
import { getDemos, getManifest } from '@/lib/docs'
import { parseDemoIndexQuery, createDemoIndexViewModel } from '@/lib/demo-index'
import { DemoIndexClient } from '@/components/demo/DemoIndexClient'

export const metadata: Metadata = {
  title: '인터랙티브 데모 색인',
  description: 'Next.js App Router 공식 문서와 연계된 데모 실습 데모 목록',
}

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
          실습 데모
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Next.js App Router 핵심 기능과 동작 원리를 다중 존(Multi-zones) 아키텍처 기반의 인터랙티브 데모로 직접 실험하고 검증합니다.
        </p>

        <DemoIndexStats totalCount={viewModel.allCount} doneCount={viewModel.allDoneCount} />
      </div>

      <DemoIndexClient viewModel={viewModel} />
    </div>
  )
}
