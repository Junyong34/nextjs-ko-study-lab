'use client'

import React, { use, useEffect } from 'react'
import { inspectPromise, toPlain } from '../../inspect'
import { useRenderEnv } from '../../hooks/useRenderEnv'
import { ProbeCard } from '../../components/ProbeCard'
import { useProbes } from '../../components/ProbeContext'
import type { SearchParamsRecord } from '../../types'

interface ClientPageProps {
  params: Promise<{ sku: string }>
  searchParams: Promise<SearchParamsRecord>
}

/**
 * Client Component page. async 컴포넌트가 될 수 없으므로 page props Promise를 React 19 use()로 언래핑한다.
 * 첫 요청(하드 로드)에서는 이 컴포넌트도 서버에서 SSR되며 use()가 서버에서 먼저 한 번 풀린다.
 */
export default function ClientSkuPage({ params, searchParams }: ClientPageProps) {
  const resolvedParams = use(params)
  const resolvedSearch = use(searchParams)
  const renderEnv = useRenderEnv()
  const { observed, report } = useProbes()

  // Promise 여부 검사는 브라우저 마운트 후 실행한다 (SSR/브라우저 값 차이로 인한 하이드레이션 불일치 방지).
  useEffect(() => {
    report({
      kind: 'client-use',
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
        render 시점 use() 결과 ({renderEnv}): sku=&quot;{resolvedParams.sku}&quot; · query=
        {JSON.stringify(resolvedSearch)}
      </div>
      <ProbeCard
        title="client/[sku]/page.tsx — 'use client' page"
        code="'use client' … const { sku } = use(params); const query = use(searchParams)"
        report={observed['client-use']?.report}
        renderEnv={renderEnv}
      />
    </div>
  )
}
