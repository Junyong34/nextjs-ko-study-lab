'use client'
import { useCallback, useState, useTransition } from 'react'
import { runScenario } from '../actions'
import { SCENARIOS } from '../lib/scenarios'
import type { ProbeResult } from '../types'

export function useScenarios() {
  const [results, setResults] = useState<Record<string, ProbeResult>>({})
  const [pending, startTransition] = useTransition()

  const run = useCallback((ids: string[]) => {
    startTransition(async () => {
      const done = await Promise.all(ids.map((id) => runScenario(id)))
      setResults((prev) => ({ ...prev, ...Object.fromEntries(done.map((r) => [r.scenarioId, r])) }))
    })
  }, [])

  const runAll = useCallback(() => run(SCENARIOS.map((s) => s.id)), [run])
  const reset = useCallback(() => setResults({}), [])

  return { results, pending, run, runAll, reset }
}
