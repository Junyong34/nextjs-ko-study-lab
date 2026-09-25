'use client'
import React, { useState } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { ProbeResult, SitemapPlan } from '../types'
import { probe } from './probe'
import { ProbeResultTable } from './ProbeResultTable'
import { VerificationFooter } from './VerificationFooter'

export function SitemapProbeConsole({ plan }: { plan: SitemapPlan }) {
  const [results, setResults] = useState<ProbeResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    setIsLoading(true)
    setError(null)
    setResults([])
    try {
      const base = plan.demoPath
      const measured: ProbeResult[] = []
      // generateSitemaps()가 반환한 id 0 ~ n-1을 차례로 요청한다.
      for (let id = 0; id < plan.sitemapCount; id++) {
        measured.push(await probe('split', `sitemap/${id}.xml`, `${base}/sitemap/${id}.xml`))
        setResults([...measured])
      }
      const extra = await Promise.all([
        probe('missing-id', `sitemap/${plan.sitemapCount}.xml (없는 id)`, `${base}/sitemap/${plan.sitemapCount}.xml`),
        probe('segment-sitemap', 'sitemap.xml (세그먼트 인덱스?)', `${base}/sitemap.xml`),
        probe('handwritten-index', 'sitemap-index.xml (직접 작성)', `${base}/sitemap-index.xml`),
      ])
      setResults([...measured, ...extra])
    } catch (err: unknown) {
      setError(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setResults([])
    setError(null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="space-y-1">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              상품 {plan.totalProducts.toLocaleString()}개 · 파일당 {plan.urlsPerSitemap.toLocaleString()}개 →
              generateSitemaps() {plan.sitemapCount}개 id
            </p>
            <p className="font-mono text-[11px] text-zinc-500">{plan.demoPath}/sitemap/[id].xml</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={isLoading}
              className="cursor-pointer rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? '요청 중...' : '실제 sitemap XML 요청'}
            </button>
            <DemoResetButton onReset={reset} />
          </div>
        </div>
        {error && <p className="font-mono text-xs text-rose-600">{error}</p>}
        <ProbeResultTable results={results} />
      </div>

      <VerificationFooter plan={plan} results={results} isComplete={!isLoading && results.length === plan.sitemapCount + 3} />
    </div>
  )
}
