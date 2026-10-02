'use client'

import { useRef, useState, useTransition } from 'react'
import { probeImageEndpoint } from '../actions'
import type { DomSnapshot, ProbeOutcome } from '../types'

/** [현재 설정 측정]: Server Action으로 /_next/image 응답을 받고, 렌더된 <img>의 DOM 값을 함께 읽는다. */
export function useConfigProbe() {
  const imgRef = useRef<HTMLImageElement>(null)
  const [outcome, setOutcome] = useState<ProbeOutcome | null>(null)
  const [dom, setDom] = useState<DomSnapshot | null>(null)
  // 초기화 때 <Image>를 다시 마운트해 이전 측정의 DOM을 재사용하지 않게 한다.
  const [run, setRun] = useState(0)
  const [isPending, startTransition] = useTransition()

  function readDom(): DomSnapshot | null {
    const img = imgRef.current
    if (!img || !img.complete || img.naturalWidth === 0) return null
    return {
      srcAttr: img.getAttribute('src'),
      srcsetAttr: img.getAttribute('srcset'),
      currentPath: new URL(img.currentSrc, window.location.href).pathname,
      naturalWidth: img.naturalWidth,
    }
  }

  function measure() {
    startTransition(async () => {
      const result = await probeImageEndpoint()
      setOutcome(result)
      setDom(readDom())
    })
  }

  function reset() {
    setOutcome(null)
    setDom(null)
    setRun((n) => n + 1)
  }

  return { imgRef, outcome, dom, run, isPending, measure, reset }
}
