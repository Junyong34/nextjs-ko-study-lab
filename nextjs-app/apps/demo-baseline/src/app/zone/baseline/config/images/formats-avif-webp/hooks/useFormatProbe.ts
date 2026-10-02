'use client'

import { useRef, useState, useTransition } from 'react'
import { probeOptimizer } from '../actions'
import { detectSupport, readAcceptHeaders } from '../lib/browser-measure'
import type { Measurement } from '../types'

/** [브라우저·서버 측정]: Accept 헤더, 디코드·인코드 지원, /_next/image 응답, <img> DOM을 한 번에 잰다. */
export function useFormatProbe() {
  const imgRef = useRef<HTMLImageElement>(null)
  const [measurement, setMeasurement] = useState<Measurement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [run, setRun] = useState(0)
  const [isPending, startTransition] = useTransition()

  function measure() {
    startTransition(async () => {
      try {
        const [accept, support] = await Promise.all([readAcceptHeaders(), detectSupport()])
        const endpoint = await probeOptimizer(accept.imgAccept ?? '')
        const img = imgRef.current
        setMeasurement({
          accept,
          support,
          endpoint,
          dom: img ? { srcAttr: img.getAttribute('src'), srcsetAttr: img.getAttribute('srcset') } : null,
          measuredAt: new Date().toISOString(),
        })
        setError(null)
      } catch (e) {
        setMeasurement(null)
        setError(e instanceof Error ? e.message : '측정 중 알 수 없는 오류')
      }
    })
  }

  function reset() {
    setMeasurement(null)
    setError(null)
    setRun((n) => n + 1)
  }

  return { imgRef, measurement, error, run, isPending, measure, reset }
}
