'use client'
import { useState, useTransition } from 'react'
import { runBurst, runFailProbe } from '../lib/probe'
import type { ActionId, BurstResult, FailProbe, Prediction, ProbeRuntime } from '../types'

export function useRegisterProbe() {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [bursts, setBursts] = useState<Partial<Record<ProbeRuntime, BurstResult>>>({})
  const [fail, setFail] = useState<FailProbe | null>(null)
  const [latest, setLatest] = useState<ActionId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const run = (id: ActionId, task: () => Promise<void>) => {
    startTransition(async () => {
      try {
        await task()
        setLatest(id)
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    })
  }

  const burst = (runtime: ProbeRuntime) =>
    run(runtime === 'nodejs' ? 'burst-nodejs' : 'burst-edge', async () => {
      const result = await runBurst(runtime)
      setBursts((prev) => ({ ...prev, [runtime]: result }))
    })

  const triggerError = () =>
    run('fail', async () => {
      setFail(await runFailProbe())
    })

  const reset = () => {
    setPrediction(null)
    setBursts({})
    setFail(null)
    setLatest(null)
    setError(null)
  }

  return { prediction, setPrediction, bursts, fail, latest, error, isPending, burst, triggerError, reset }
}
