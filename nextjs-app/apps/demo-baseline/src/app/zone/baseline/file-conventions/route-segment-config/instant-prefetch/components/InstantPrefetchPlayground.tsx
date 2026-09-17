'use client'
import React, { useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { PrefetchProbePanel } from './PrefetchProbePanel'
import { VerificationFooter } from './VerificationFooter'
import type { ProbeCase, ProbeResult } from '../types'

let nextId = 1

async function runProbe(pathname: string, probeCase: ProbeCase): Promise<ProbeResult> {
  const headers: HeadersInit =
    probeCase === 'rsc-prefetch' ? { RSC: '1', 'Next-Router-Prefetch': '1' } : {}

  const res = await fetch(pathname, { headers, cache: 'no-store' })

  return {
    id: nextId++,
    probeCase,
    status: res.status,
    redirected: res.redirected,
    contentType: res.headers.get('content-type'),
    vary: res.headers.get('vary'),
    fetchedAt: new Date().toLocaleTimeString('ko-KR'),
  }
}

export function InstantPrefetchPlayground({ detailHref }: { detailHref: string }) {
  const [results, setResults] = useState<ProbeResult[]>([])
  const [isLoading, setIsLoading] = useState<ProbeCase | null>(null)

  const handleRun = async (probeCase: ProbeCase) => {
    setIsLoading(probeCase)
    try {
      const result = await runProbe(window.location.pathname, probeCase)
      setResults((prev) => [result, ...prev].slice(0, 6))
    } finally {
      setIsLoading(null)
    }
  }

  const latestNormal = results.find((r) => r.probeCase === 'normal')
  const latestRsc = results.find((r) => r.probeCase === 'rsc-prefetch')

  return (
    <>
      <DemoPlaygroundCard title="RSC 프리페치 요청·응답 실측">
        <PrefetchProbePanel
          results={results}
          isLoading={isLoading}
          onRun={handleRun}
          detailHref={detailHref}
        />
        <div className="flex justify-end pt-3">
          <DemoResetButton onReset={() => setResults([])} label="요청 로그 초기화" />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter latestNormal={latestNormal} latestRsc={latestRsc} />
    </>
  )
}
