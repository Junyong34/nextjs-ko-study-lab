'use client'
import { useState } from 'react'
import type { ProbeRun } from '../types'
import { PROBE_IDS } from '../lib/catalog'
import { probeProduct } from '../lib/measure'

export function useCatalogProbe() {
  const [selectedId, setSelectedId] = useState(PROBE_IDS[0])
  // id별 최신 측정 결과. 같은 id를 다시 측정하면 덮어쓴다.
  const [runs, setRuns] = useState<Record<string, ProbeRun>>({})
  const [isRunning, setIsRunning] = useState(false)

  const run = async () => {
    setIsRunning(true)
    try {
      const result = await probeProduct(window.location.pathname, selectedId)
      setRuns((prev) => ({ ...prev, [selectedId]: result }))
    } finally {
      setIsRunning(false)
    }
  }

  const reset = () => {
    setRuns({})
    setSelectedId(PROBE_IDS[0])
  }

  return { selectedId, setSelectedId, runs, isRunning, run, reset }
}
