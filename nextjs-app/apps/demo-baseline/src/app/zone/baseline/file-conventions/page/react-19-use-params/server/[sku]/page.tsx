import React, { Suspense } from 'react'
import { inspectPromise, toPlain } from '../../inspect'
import { ProbeCard } from '../../components/ProbeCard'
import { ProbeReporter } from '../../components/ProbeContext'
import { ForwardedUnwrap } from '../../components/ForwardedUnwrap'
import type { ProbeReport, SearchParamsRecord } from '../../types'

interface ServerPageProps {
  params: Promise<{ sku: string }>
  searchParams: Promise<SearchParamsRecord>
}

/**
 * Server Component page (기본값). params/searchParams는 Promise로 주입되므로 await로 언래핑한다.
 * await "전"에 prop 자체를 검사해 Promise임을 실측하고, 같은 Promise를 await 없이 Client Component에도 넘긴다.
 */
export default async function ServerSkuPage({ params, searchParams }: ServerPageProps) {
  const paramsInfo = inspectPromise(params)
  const searchInfo = inspectPromise(searchParams)

  const resolvedParams = await params
  const resolvedSearch = await searchParams

  const report: ProbeReport = {
    kind: 'server-await',
    unwrapApi: 'await',
    inspectedIn: typeof window === 'undefined' ? 'server' : 'browser',
    runtime: process.env.NEXT_RUNTIME ?? 'unknown',
    params: paramsInfo,
    searchParams: searchInfo,
    resolvedParams: toPlain(resolvedParams),
    resolvedSearchParams: toPlain(resolvedSearch),
    observedAt: new Date().toISOString(),
  }

  return (
    <div className="space-y-3">
      <ProbeCard
        title="server/[sku]/page.tsx — Server Component page"
        code="export default async function Page({ params }) { const { sku } = await params }"
        report={report}
        renderEnv={report.inspectedIn}
      />
      <ProbeReporter report={report} />
      <Suspense
        fallback={
          <div className="rounded border border-dashed border-zinc-300 p-3 text-xs text-zinc-500 dark:border-zinc-700">
            Suspense fallback — 전달된 Promise를 use()가 기다리는 중
          </div>
        }
      >
        <ForwardedUnwrap params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
