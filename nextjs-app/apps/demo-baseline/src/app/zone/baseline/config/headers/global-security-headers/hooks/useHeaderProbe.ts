'use client'
import { useState, useTransition } from 'react'
import { measureHeaders } from '../actions'
import { PROBE_PATHS, type MeasureResult } from '../types'

export function useHeaderProbe() {
  const [targetPath, setTargetPath] = useState<string>(PROBE_PATHS[0].path)
  const [controlPath, setControlPath] = useState<string>(PROBE_PATHS[2].path)
  const [result, setResult] = useState<MeasureResult | null>(null)
  const [runs, setRuns] = useState(0)
  const [isPending, startTransition] = useTransition()

  const measure = () =>
    startTransition(async () => {
      const r = await measureHeaders(targetPath, controlPath)
      setResult(r)
      setRuns((n) => n + 1)
    })

  const reset = () => {
    setResult(null)
    setRuns(0)
    setTargetPath(PROBE_PATHS[0].path)
    setControlPath(PROBE_PATHS[2].path)
  }

  return { targetPath, setTargetPath, controlPath, setControlPath, result, runs, isPending, measure, reset }
}
