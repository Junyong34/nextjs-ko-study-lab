'use client'
import { useState, useTransition } from 'react'
import { REGEX_DEMO_BASE } from '@/config/demo-next-config/redirects-regex'
import { CASES } from '../lib/cases'
import { summarize } from '../lib/judge'
import type { Prediction, ProbeOutcome, ProbeResult } from '../types'

async function probe(path: string): Promise<ProbeOutcome> {
  try {
    const res = await fetch(`${REGEX_DEMO_BASE}/probe?path=${encodeURIComponent(path)}`, { cache: 'no-store' })
    const body = await res.json()
    return res.ok ? (body as ProbeResult) : { error: body.error ?? `probe 실패 (${res.status})` }
  } catch (e) {
    return { error: e instanceof Error ? e.message : '알 수 없는 오류' }
  }
}

export function useRedirectProbes() {
  const [outcomes, setOutcomes] = useState<Record<string, ProbeOutcome>>({})
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({})
  const [customPath, setCustomPath] = useState('/catalog/2025/42')
  const [custom, setCustom] = useState<ProbeOutcome | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const run = (id: string, path: string) => {
    setPendingId(id)
    startTransition(async () => {
      const outcome = await probe(path)
      if (id === 'custom') setCustom(outcome)
      else setOutcomes((prev) => ({ ...prev, [id]: outcome }))
      setPendingId(null)
    })
  }

  const runAll = () => {
    setPendingId('all')
    startTransition(async () => {
      for (const c of CASES) {
        const outcome = await probe(c.path)
        setOutcomes((prev) => ({ ...prev, [c.id]: outcome }))
      }
      setPendingId(null)
    })
  }

  const reset = () => {
    setOutcomes({})
    setPredictions({})
    setCustom(null)
    setCustomPath('/catalog/2025/42')
  }

  const predict = (id: string, p: Prediction) => setPredictions((prev) => ({ ...prev, [id]: p }))

  return {
    outcomes, predictions, predict, customPath, setCustomPath, custom,
    pendingId, isPending, run, runAll, reset,
    summary: summarize(CASES, outcomes, predictions),
  }
}
