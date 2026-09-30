'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { usePathname } from 'next/navigation'
import { probe, readScreensFromDom, relativePath } from '../lib/measure'
import type { Probe, Snapshot } from '../types'

const PROBE_PATHS = ['/shoes', '/strict/detail']

export function useSlotObservation(rootRef: RefObject<HTMLElement | null>) {
  const pathname = usePathname()
  const prev = useRef<string | null>(null)
  const lastSnapshot = useRef<Snapshot | null>(null)
  const [load, setLoad] = useState<Snapshot | null>(null)
  const [soft, setSoft] = useState<Snapshot | null>(null)
  const [probes, setProbes] = useState<Record<string, Probe>>({})
  const [probing, setProbing] = useState(false)
  const [current, setCurrent] = useState<Snapshot | null>(null)

  // 첫 실행은 문서 로드, 이후 pathname 변화는 클라이언트(소프트) 이동으로 구분한다.
  useEffect(() => {
    if (!rootRef.current || prev.current === pathname) return
    const snap: Snapshot = {
      path: relativePath(pathname),
      via: prev.current === null ? 'load' : 'soft',
      screens: readScreensFromDom(rootRef.current),
      previousScreens: lastSnapshot.current?.screens,
    }
    prev.current = pathname
    lastSnapshot.current = snap
    setCurrent(snap)
    if (snap.via === 'load') setLoad(snap)
    else setSoft(snap)
  }, [pathname, rootRef])

  const runProbes = useCallback(async () => {
    setProbing(true)
    try {
      const results = await Promise.all(PROBE_PATHS.map(probe))
      setProbes(Object.fromEntries(results.map((r) => [r.path, r])))
    } finally {
      setProbing(false)
    }
  }, [])

  return { load, soft, current, probes, probing, runProbes }
}
