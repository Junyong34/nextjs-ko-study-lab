'use client'
import { useState, useTransition } from 'react'
import { scenarioById } from '../expectations'
import { measure } from '../lib/measure'
import type { Measurement, Prediction, ScenarioId } from '../types'

export function useRewriteProbe() {
  const [value, setValue] = useState('123')
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [results, setResults] = useState<Measurement[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // 숫자만 허용한다: has의 \d+ 조건이 이 입력과 맞물려 기대값을 결정한다.
  const changeValue = (raw: string) => setValue(raw.replace(/\D/g, '').slice(0, 6))

  const send = (id: ScenarioId) => {
    startTransition(async () => {
      try {
        const m = await measure(scenarioById(id), value, prediction)
        setResults((prev) => [m, ...prev].slice(0, 5))
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    })
  }

  const reset = () => {
    setResults([])
    setPrediction(null)
    setError(null)
    setValue('123')
  }

  return { value, changeValue, prediction, setPrediction, results, error, isPending, send, reset }
}
