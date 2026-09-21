'use client'

import { useEffect } from 'react'
import { useLoadingObservation } from './LoadingObservation'

/** catalog/[run]/page.tsx의 지연이 끝나고 실제로 마운트된 시점을 보고한다. */
export function CatalogReadyReporter({ runId }: { runId: string }) {
  const { markCatalogReady } = useLoadingObservation()

  useEffect(() => {
    markCatalogReady(runId)
  }, [runId, markCatalogReady])

  return null
}
