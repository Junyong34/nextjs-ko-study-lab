'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ShareButton } from '@study/ui'
import type { DemoMeta } from './types'
import { getDemoBadge } from './data'
import { visualizeCatalog } from './catalog'
import { VisualizeRow } from './VisualizeRow'
import { VisualizeViewTracker } from './VisualizeViewTracker'
import { useVisualizeReturnUrl } from './useVisualizeNavigation'

interface VisualizeDetailViewerProps {
  demo: DemoMeta
  relatedDemos: DemoMeta[]
}

export function VisualizeDetailViewer({ demo, relatedDemos }: VisualizeDetailViewerProps) {
  const badge = getDemoBadge(demo)
  const returnUrl = useVisualizeReturnUrl(demo.key)
  const related = visualizeCatalog.filter((entry) => relatedDemos.some((item) => item.key === entry.key))

  return (
    <div className="space-y-6">
      <VisualizeViewTracker demoKey={demo.key} demoTitle={demo.title} group={demo.group} />
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Link href={returnUrl} scroll={false} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            시각화 목록
          </Link>
          <ShareButton title={`${demo.title} - Next.js & React 시각화`} url={`/visualize/${demo.key}`} />
        </div>
        <div>
          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs ${badge.className}`}>{badge.label}</span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{demo.title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{demo.description}</p>
        </div>
      </header>
      <section aria-label={`${demo.title} 시각화`} className="min-w-0">{demo.component}</section>
      {related.length > 0 && (
        <section aria-labelledby="related-visualizations" className="space-y-3 pt-4">
          <h2 id="related-visualizations" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">같은 그룹의 다른 시각화</h2>
          <ul className="divide-y divide-zinc-100 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {related.map((entry) => <VisualizeRow key={entry.key} entry={entry} />)}
          </ul>
        </section>
      )}
    </div>
  )
}
