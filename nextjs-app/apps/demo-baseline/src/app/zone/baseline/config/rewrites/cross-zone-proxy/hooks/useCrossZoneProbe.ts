'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import { scenarioById } from '../expectations'
import { measure } from '../lib/measure'
import type { Measurement, ScenarioId, ZoneId } from '../types'

const MAX_RESULTS = 5
const DEFAULT_TITLE = 'rewrites 프록시'

const revoke = (m: Measurement) => {
  if (m.imageUrl) URL.revokeObjectURL(m.imageUrl)
  if (m.baselineImageUrl) URL.revokeObjectURL(m.baselineImageUrl)
}

export function useCrossZoneProbe() {
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [prediction, setPrediction] = useState<ZoneId | null>(null)
  const [results, setResults] = useState<Measurement[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // 화면을 떠날 때 남은 이미지 object URL을 해제한다.
  const resultsRef = useRef<Measurement[]>([])
  useEffect(() => {
    resultsRef.current = results
  }, [results])
  useEffect(() => () => resultsRef.current.forEach(revoke), [])

  const send = (id: ScenarioId) => {
    startTransition(async () => {
      try {
        const m = await measure(scenarioById(id), title, prediction)
        setResults((prev) => {
          prev.slice(MAX_RESULTS - 1).forEach(revoke)
          return [m, ...prev].slice(0, MAX_RESULTS)
        })
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    })
  }

  const reset = () => {
    results.forEach(revoke)
    setResults([])
    setPrediction(null)
    setError(null)
    setTitle(DEFAULT_TITLE)
  }

  return { title, setTitle, prediction, setPrediction, results, error, isPending, send, reset }
}
