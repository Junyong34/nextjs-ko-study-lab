'use client'
import { useState, useTransition } from 'react'
import { BASE, CASES } from '../lib/cases'
import { summarize } from '../lib/judge'
import type { Prediction, ProbeOutcome, ProbeResult } from '../types'

async function probe(id: string): Promise<ProbeOutcome> {
  try {
    const res = await fetch(`${BASE}/probe?case=${encodeURIComponent(id)}`, { cache: 'no-store' })
    const body = await res.json()
    return res.ok ? (body as ProbeResult) : { error: body.error ?? `probe 실패 (${res.status})` }
  } catch (e) {
    return { error: e instanceof Error ? e.message : '알 수 없는 오류' }
  }
}

/** 버튼을 누르기 전에는 요청하지 않는다. 모든 판정은 서버가 읽어 온 응답으로만 한다. */
export function useSlashProbes() {
  const [outcomes, setOutcomes] = useState<Record<string, ProbeOutcome>>({})
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({})
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const run = (id: string) => {
    setPendingId(id)
    startTransition(async () => {
      const outcome = await probe(id)
      setOutcomes((prev) => ({ ...prev, [id]: outcome }))
      setPendingId(null)
    })
  }

  const runAll = () => {
    setPendingId('all')
    startTransition(async () => {
      for (const c of CASES) {
        const outcome = await probe(c.id)
        setOutcomes((prev) => ({ ...prev, [c.id]: outcome }))
      }
      setPendingId(null)
    })
  }

  const reset = () => {
    setOutcomes({})
    setPredictions({})
  }

  const predict = (id: string, p: Prediction) => setPredictions((prev) => ({ ...prev, [id]: p }))

  return { outcomes, predictions, predict, pendingId, run, runAll, reset, summary: summarize(CASES, outcomes, predictions) }
}
