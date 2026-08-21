import React from 'react'
import type { Metadata } from 'next'
import { PlayCircle } from 'lucide-react'
import { DemoIndexCard, DemoIndexStats } from '@study/ui'
import { getDemos, getManifest, findDocForDemo } from '@/lib/docs'

export const metadata: Metadata = {
  title: '인터랙티브 데모 색인',
  description: 'Next.js App Router 공식 문서와 연계된 데모 실습 데모 목록',
}

export default function DemoIndexPage() {
  const demos = getDemos()
  const manifest = getManifest()

  const doneCount = demos.filter((d) => d.status === 'done').length

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

        <DemoIndexStats totalCount={demos.length} doneCount={doneCount} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          데모 목록 ({demos.length})
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {demos.map((demo) => (
            <DemoIndexCard
              key={demo.url}
              url={demo.url}
              title={demo.title}
              zone={demo.zone}
              status={demo.status}
              doc={demo.doc}
              docUrl={findDocForDemo(manifest, demo.doc)?.url ?? '/'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
