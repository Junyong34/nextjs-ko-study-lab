'use client'
import { useState, useTransition } from 'react'
import { readAll } from '../lib/readings'
import { scanChunks } from '../lib/scanChunks'
import type { AccessReading, ChunkScan, ServerRead } from '../types'

export interface ProbeSnapshot {
  server: ServerRead
  browser: AccessReading[]
  chunks: ChunkScan
}

export function useInjectionProbe(expectedValue: string, rawIdentifier: string) {
  const [snapshot, setSnapshot] = useState<ProbeSnapshot | null>(null)
  const [runs, setRuns] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const probe = () =>
    startTransition(async () => {
      try {
        const res = await fetch(`${window.location.pathname}/api/server-read`, { cache: 'no-store' })
        const server: ServerRead = await res.json()
        const chunks = await scanChunks(expectedValue, rawIdentifier)
        setSnapshot({ server, browser: readAll(), chunks })
        setError(null)
        setRuns((n) => n + 1)
      } catch (e) {
        setError(e instanceof Error ? e.message : '측정 중 알 수 없는 오류')
      }
    })

  const reset = () => {
    setSnapshot(null)
    setRuns(0)
    setError(null)
  }

  return { snapshot, runs, error, isPending, probe, reset }
}
