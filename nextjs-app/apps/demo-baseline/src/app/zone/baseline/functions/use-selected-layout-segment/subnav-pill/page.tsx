import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-selected-layout-segment/subnav-pill')

import React from 'react'
import { DEMO_PRODUCT } from './types'

export default function OverviewPage() {
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-3.5 text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
      <p className="font-bold text-zinc-900 dark:text-zinc-100">
        개요 — 기본 경로 (useSelectedLayoutSegment() 반환값: null)
      </p>
      <p>{DEMO_PRODUCT.description}</p>
      <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
        {DEMO_PRODUCT.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  )
}
