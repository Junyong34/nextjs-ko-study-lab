'use client'
import { useState, useTransition } from 'react'
import type { ProbeRun } from '../types'
import { runProbes } from '../lib/probe'

export function useZoneProbe() {
  const [run, setRun] = useState<ProbeRun | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const probe = () =>
    startTransition(async () => {
      try {
        setError(null)
        setRun(await runProbes())
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    })

  const reset = () => {
    setRun(null)
    setError(null)
  }

  return { run, error, isPending, probe, reset }
}
