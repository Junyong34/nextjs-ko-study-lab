'use client'
import { useCallback, useState } from 'react'
import { serializeJsonLdSafe, serializeJsonLdUnsafe } from '../json-ld'
import { parseInIsolatedDocument, probeSsrHtml } from './inspect'
import type { ParseContrast, ProductJsonLd, ProductRecord, SsrProbe } from '../types'

export function useJsonLdProbe(product: ProductRecord, jsonLd: ProductJsonLd, injectionMarker: string) {
  const [ssr, setSsr] = useState<SsrProbe | null>(null)
  const [contrast, setContrast] = useState<ParseContrast[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runSsrProbe = useCallback(async () => {
    setIsRunning(true)
    setError(null)
    try {
      setSsr(await probeSsrHtml(product, jsonLd))
    } catch (err: unknown) {
      setError(String(err))
    } finally {
      setIsRunning(false)
    }
  }, [product, jsonLd])

  const runContrast = useCallback(() => {
    setContrast([
      parseInIsolatedDocument('치환 전: JSON.stringify(jsonLd)', serializeJsonLdUnsafe(jsonLd), product, injectionMarker),
      parseInIsolatedDocument(
        "치환 후: JSON.stringify(jsonLd).replace(/</g, '\\\\u003c')",
        serializeJsonLdSafe(jsonLd),
        product,
        injectionMarker,
      ),
    ])
  }, [product, jsonLd, injectionMarker])

  const reset = useCallback(() => {
    setSsr(null)
    setContrast(null)
    setError(null)
  }, [])

  return { ssr, contrast, error, isRunning, runSsrProbe, runContrast, reset }
}
