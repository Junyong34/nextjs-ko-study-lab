'use client'

import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { installViewTransitionProbe, supportsViewTransition } from '../lib/probe'
import type { EnvInfo, NavigationRecord, ProbeState, TransitionRecord } from '../types'

/** layout에서 한 번 호출해 목록 ↔ 상세 이동 동안 전환 기록을 유지한다. */
export function useTransitionProbe(): ProbeState {
  const [env, setEnv] = useState<EnvInfo | null>(null)
  const [transitions, setTransitions] = useState<TransitionRecord[]>([])
  const [navigations, setNavigations] = useState<NavigationRecord[]>([])
  const pathname = usePathname()

  // 전환은 라우터 commit 중에 시작되므로, 이동 전에 패치가 끝나도록 layout effect에서 설치한다.
  useLayoutEffect(() => {
    setEnv({
      supported: supportsViewTransition(),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    })
    return installViewTransitionProbe({
      onStart: (r) => setTransitions((prev) => [...prev, r]),
      onUpdate: (id, patch) => setTransitions((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    })
  }, [])

  // 최초 진입(하드 로드)은 이동이 아니므로 첫 pathname은 기준값으로만 쓴다.
  const [initialPath] = useState(pathname)
  useEffect(() => {
    if (pathname === initialPath) return
    setNavigations((prev) => [...prev, { at: performance.now(), pathname }])
  }, [pathname, initialPath])

  const reset = useCallback(() => {
    setTransitions([])
    setNavigations([])
  }, [])

  return { env, transitions, navigations, reset }
}
