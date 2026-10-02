'use client'

import { useCallback, useState } from 'react'
import { BASE, PRODUCTS, UNKNOWN_ID } from '../lib/products'
import type { DynamicProbe } from '../types'

const PATHS = [`/products/${PRODUCTS[0].id}`, `/products/${UNKNOWN_ID}`]

/** 문서 요청(Accept: text/html)으로 두 상세 경로의 실제 상태 코드를 읽는다. */
export function useDynamicProbe() {
  const [probes, setProbes] = useState<DynamicProbe[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const run = useCallback(async () => {
    setBusy(true)
    setError(null)
    try {
      const results = await Promise.all(
        PATHS.map(async (path) => {
          const res = await fetch(`${BASE}${path}`, { cache: 'no-store', headers: { Accept: 'text/html' } })
          await res.body?.cancel()
          return { path, status: res.status }
        }),
      )
      setProbes(results)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }, [])

  const reset = useCallback(() => {
    setProbes(null)
    setError(null)
  }, [])

  return { probes, error, busy, run, reset }
}
