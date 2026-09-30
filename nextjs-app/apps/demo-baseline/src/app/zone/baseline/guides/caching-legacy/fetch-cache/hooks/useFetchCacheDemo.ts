'use client'
import { useState, useTransition } from 'react'
import { invalidateFetchCache, probeSource } from '../actions'
import type { FetchMode, FetchProbeResult } from '../types'

export function useFetchCacheDemo() {
  const [calls, setCalls] = useState<FetchProbeResult[]>([])
  const [epoch, setEpoch] = useState(0)
  const [pending, startTransition] = useTransition()

  const probe = (mode: FetchMode) =>
    startTransition(async () => {
      const calledAt = Date.now()
      const r = await probeSource(mode)
      setCalls((prev) => [...prev, { ...r, calledAt, epoch }])
    })

  const invalidate = () =>
    startTransition(async () => {
      await invalidateFetchCache()
      setEpoch((e) => e + 1)
    })

  // Data Cache 항목을 무효화하고 기록을 비워 초기 상태로 돌아간다.
  const reset = async () => {
    await invalidateFetchCache()
    setCalls([])
    setEpoch(0)
  }

  return { calls, pending, probe, invalidate, reset }
}
