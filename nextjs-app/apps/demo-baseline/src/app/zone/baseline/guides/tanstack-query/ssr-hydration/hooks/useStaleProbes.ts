'use client'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { dealsKey } from '../lib/deals-query'
import type { DealsVariant, ProbeStaleTime, StaleProbeRun } from '../types'
import { waitUntilIdle } from './useHydrationProbe'

/** 같은 queryKey를 다른 staleTime으로 구독하는 컴포넌트를 추가 마운트한 기록 */
export function useStaleProbes(variant: DealsVariant) {
  const qc = useQueryClient()
  const [runs, setRuns] = useState<StaleProbeRun[]>([])
  const [settledIds, setSettledIds] = useState<number[]>([])

  const add = (staleTime: ProbeStaleTime) => {
    const st = qc.getQueryState(dealsKey(variant))
    const run: StaleProbeRun = {
      id: runs.length + 1,
      staleTime,
      ageAtMount: st?.dataUpdatedAt ? Date.now() - st.dataUpdatedAt : Number.POSITIVE_INFINITY,
      startT: performance.now(),
    }
    setRuns((prev) => [...prev, run])
    waitUntilIdle(qc, dealsKey(variant), () => setSettledIds((prev) => [...prev, run.id]))
  }

  const latest = runs[runs.length - 1] ?? null
  return { runs, latest, latestSettled: latest ? settledIds.includes(latest.id) : false, add }
}
