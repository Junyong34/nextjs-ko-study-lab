'use client'

import React, { use, useEffect } from 'react'
import { inspectPromise, toPlain } from '../inspect'
import { useRenderEnv } from '../hooks/useRenderEnv'
import { useProbes } from './ProbeContext'
import { ProbeCard } from './ProbeCard'
import type { SearchParamsRecord } from '../types'

interface ForwardedUnwrapProps {
  /** server/[sku]/page.tsx가 await하지 않고 그대로 넘긴 page props Promise */
  params: Promise<{ sku: string }>
  searchParams: Promise<SearchParamsRecord>
}

/**
 * 서버 page가 Promise를 그대로 prop으로 넘기고, 이 Client Component가 use()로 언래핑한다.
 * Promise가 아직 풀리지 않았다면 use()가 가장 가까운 <Suspense>(server page에 있음)를 트리거한다.
 */
export function ForwardedUnwrap({ params, searchParams }: ForwardedUnwrapProps) {
  const resolvedParams = use(params)
  const resolvedSearch = use(searchParams)
  const renderEnv = useRenderEnv()
  const { observed, report } = useProbes()

  useEffect(() => {
    report({
      kind: 'forwarded-use',
      unwrapApi: 'use()',
      inspectedIn: typeof window === 'undefined' ? 'server' : 'browser',
      runtime: 'client bundle',
      params: inspectPromise(params),
      searchParams: inspectPromise(searchParams),
      resolvedParams: toPlain(resolvedParams),
      resolvedSearchParams: toPlain(resolvedSearch),
      observedAt: new Date().toISOString(),
    })
  }, [params, searchParams, resolvedParams, resolvedSearch, report])

  return (
    <div className="space-y-1.5">
      <div className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
        render 시점 use() 결과: sku=&quot;{resolvedParams.sku}&quot; · query={JSON.stringify(resolvedSearch)}
      </div>
      <ProbeCard
        title="Server page → Client Component로 전달된 Promise prop"
        code="<ForwardedUnwrap params={params} /> → const { sku } = use(params)"
        report={observed['forwarded-use']?.report}
        renderEnv={renderEnv}
      />
    </div>
  )
}
