'use client'
import { useRef, useState } from 'react'
import type { PaneSnapshot, ThemeKey } from '../types'
import { inspectPane } from '../lib/inspect'

export function useThemeProbe() {
  const rawRef = useRef<HTMLDivElement>(null)
  const mappedRef = useRef<HTMLDivElement>(null)
  const [themeOn, setThemeOn] = useState(true)
  // 테마 래퍼를 켠 상태와 끈 상태의 측정을 따로 보관해 비교한다.
  const [snapshots, setSnapshots] = useState<Partial<Record<ThemeKey, PaneSnapshot>>>({})

  const measure = () => {
    if (!rawRef.current || !mappedRef.current) return
    const snapshot: PaneSnapshot = {
      themeOn,
      raw: inspectPane(rawRef.current),
      mapped: inspectPane(mappedRef.current),
      measuredAt: new Date().toLocaleTimeString('ko-KR'),
    }
    setSnapshots((prev) => ({ ...prev, [themeOn ? 'on' : 'off']: snapshot }))
  }

  const reset = () => {
    setThemeOn(true)
    setSnapshots({})
  }

  return { rawRef, mappedRef, themeOn, setThemeOn, snapshots, measure, reset }
}
