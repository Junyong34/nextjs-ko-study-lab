'use client'

import { useEffect } from 'react'
import { useLoadingObservation } from './LoadingObservation'

/** catalog/[run]/[product]/page.tsx의 지연이 끝나고 실제로 마운트된 시점을 보고한다. */
export function ProductReadyReporter({ runId, productId }: { runId: string; productId: string }) {
  const { markProductReady } = useLoadingObservation()

  useEffect(() => {
    markProductReady(runId, productId)
  }, [runId, productId, markProductReady])

  return null
}
