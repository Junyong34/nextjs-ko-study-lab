'use client'

import { useState } from 'react'
import { DEMO_BASE, LEGACY_SERVICES } from '../constants'
import type { BffOrderResponse, ScenarioKind, ScenarioResult, ScenarioResults } from '../types'

/**
 * 이번 실행(runId)에 해당하는 Resource Timing 항목을 모은다.
 * fetch가 끝난 직후에는 항목이 아직 버퍼에 안 들어왔을 수 있어, 기대 개수가 모일 때까지 짧게 재확인한다.
 * (결과를 만드는 타이머가 아니라 브라우저가 기록을 마칠 때까지 기다리는 용도다.)
 */
async function collectEntries(runId: string, expected: number): Promise<PerformanceResourceTiming[]> {
  const pick = () =>
    (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).filter((e) =>
      e.name.includes(`run=${runId}`),
    )
  for (let i = 0; i < 20; i++) {
    const found = pick()
    if (found.length >= expected) return found
    await new Promise((r) => setTimeout(r, 25))
  }
  return pick()
}

function summarize(
  kind: ScenarioKind,
  runId: string,
  clientMs: number,
  entries: PerformanceResourceTiming[],
  server: ScenarioResult['server'],
  dataBytes: number | null,
): ScenarioResult {
  return {
    kind,
    runId,
    requestCount: entries.length,
    requestedPaths: entries.map((e) => new URL(e.name).pathname.replace(DEMO_BASE, '…')),
    clientMs,
    bodyBytes: entries.reduce((acc, e) => acc + e.decodedBodySize, 0),
    dataBytes,
    transferBytes: entries.reduce((acc, e) => acc + e.transferSize, 0),
    server,
  }
}

const newRunId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export function useAggregationRuns() {
  const [results, setResults] = useState<ScenarioResults>({})
  const [running, setRunning] = useState<ScenarioKind | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastBff, setLastBff] = useState<BffOrderResponse | null>(null)

  const run = async (kind: ScenarioKind) => {
    setRunning(kind)
    setError(null)
    const runId = newRunId()
    try {
      const t0 = performance.now()
      let server: ScenarioResult['server'] = null
      let dataBytes: number | null = null
      let expected = 1

      if (kind === 'direct') {
        // 브라우저가 레거시 엔드포인트 3개를 직접(병렬로) 호출한다 — 클라이언트 입장에서 가장 빠른 경우.
        expected = LEGACY_SERVICES.length
        const responses = await Promise.all(
          LEGACY_SERVICES.map((s) => fetch(`${DEMO_BASE}/legacy/${s}?run=${runId}`, { cache: 'no-store' })),
        )
        if (responses.some((r) => !r.ok)) throw new Error('레거시 API 응답 오류')
        await Promise.all(responses.map((r) => r.json()))
      } else {
        const mode = kind === 'bff-serial' ? 'serial' : 'parallel'
        const res = await fetch(`${DEMO_BASE}/bff?mode=${mode}&run=${runId}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`BFF 응답 오류 (HTTP ${res.status})`)
        const body: BffOrderResponse = await res.json()
        server = body.meta
        dataBytes = new TextEncoder().encode(JSON.stringify({ order: body.order, shipping: body.shipping })).length
        setLastBff(body)
      }

      const clientMs = performance.now() - t0
      const entries = await collectEntries(runId, expected)
      const result = summarize(kind, runId, clientMs, entries, server, dataBytes)
      setResults((prev) => ({ ...prev, [kind]: result }))
    } catch (e) {
      setError(e instanceof Error ? e.message : '요청 실패')
    } finally {
      setRunning(null)
    }
  }

  const reset = () => {
    setResults({})
    setLastBff(null)
    setError(null)
  }

  return { results, running, error, lastBff, run, reset }
}
