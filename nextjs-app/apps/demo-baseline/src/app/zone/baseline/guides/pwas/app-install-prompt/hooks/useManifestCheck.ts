'use client'
import { useCallback, useEffect, useState } from 'react'
import { inspectManifest } from '../lib/manifest-check'
import type { ManifestReport } from '../types'

export function useManifestCheck() {
  const [report, setReport] = useState<ManifestReport | null>(null)
  const [running, setRunning] = useState(false)

  const run = useCallback(async () => {
    setRunning(true)
    try {
      setReport(await inspectManifest())
    } finally {
      setRunning(false)
    }
  }, [])

  useEffect(() => {
    // 마운트 시 한 번 실제 manifest를 fetch해 검사한다.
    run()
  }, [run])

  return { report, running, run }
}
