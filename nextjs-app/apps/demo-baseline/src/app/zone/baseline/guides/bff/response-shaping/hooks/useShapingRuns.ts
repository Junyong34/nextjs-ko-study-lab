'use client'

import { useState } from 'react'
import { DEMO_BASE } from '../constants'
import type { ComparisonResults, EndpointKind, MeasuredResponse } from '../types'
import { inspectJson } from './inspectJson'

/**
 * 이번 요청의 Resource Timing 항목을 찾는다. 응답 본문을 다 읽은 직후에는 항목이 아직 버퍼에 없을 수 있어
 * 나타날 때까지 짧게 재확인한다. (결과를 만드는 타이머가 아니라 브라우저 기록을 기다리는 용도다.)
 */
async function findEntry(url: string): Promise<PerformanceResourceTiming | null> {
  for (let i = 0; i < 20; i++) {
    const entry = (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).find((e) =>
      e.name.endsWith(url),
    )
    if (entry) return entry
    await new Promise((r) => setTimeout(r, 25))
  }
  return null
}

async function measure(kind: EndpointKind, id: string, runId: string): Promise<MeasuredResponse> {
  const url = `${DEMO_BASE}/${kind}?id=${encodeURIComponent(id)}&run=${runId}`
  const res = await fetch(url, { cache: 'no-store' })
  const body: unknown = await res.json()
  const entry = await findEntry(url)
  const serverTiming = res.headers.get('Server-Timing')

  return {
    url: url.replace(DEMO_BASE, '…'),
    status: res.status,
    decodedBodySize: entry?.decodedBodySize ?? 0,
    encodedBodySize: entry?.encodedBodySize ?? 0,
    transferSize: entry?.transferSize ?? 0,
    ...inspectJson(body),
    legacyCalled: kind === 'bff' ? Boolean(serverTiming?.includes('legacy')) : null,
    body,
  }
}

const newRunId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export function useShapingRuns() {
  const [results, setResults] = useState<ComparisonResults>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [running, setRunning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = async (id: string) => {
    setRunning(id)
    setError(null)
    const runId = newRunId()
    try {
      // 같은 상품을 원본 경로와 BFF 경로로 차례로 받아 같은 기준(Resource Timing + JSON 순회)으로 잰다.
      const legacy = await measure('legacy', id, runId)
      const bff = await measure('bff', id, runId)
      setResults((prev) => ({ ...prev, [id]: { id, runId, legacy, bff } }))
      setSelectedId(id)
    } catch (e) {
      setError(e instanceof Error ? e.message : '요청 실패')
    } finally {
      setRunning(null)
    }
  }

  const reset = () => {
    performance.clearResourceTimings()
    setResults({})
    setSelectedId(null)
    setError(null)
  }

  return { results, selected: selectedId ? results[selectedId] ?? null : null, running, error, run, reset }
}
