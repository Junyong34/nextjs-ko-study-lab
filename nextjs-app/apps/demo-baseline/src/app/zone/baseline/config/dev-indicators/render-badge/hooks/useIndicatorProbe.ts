'use client'
import { useState } from 'react'
import type { IndicatorProbe } from '../types'
import { probeIndicator } from '../lib/probeIndicator'

export function useIndicatorProbe() {
  const [probes, setProbes] = useState<IndicatorProbe[]>([])
  // 버튼을 누른 순간의 DOM을 읽는다. 값을 만들어 내지 않고 측정 결과만 쌓는다.
  const measure = () => setProbes((prev) => [probeIndicator(), ...prev].slice(0, 5))
  const reset = () => setProbes([])
  return { probes, measure, reset }
}
