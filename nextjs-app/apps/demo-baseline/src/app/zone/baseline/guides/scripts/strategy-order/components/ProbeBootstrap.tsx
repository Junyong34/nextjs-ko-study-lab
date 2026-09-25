'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { updateProbeStore } from '../hooks/useProbeStore'

/**
 * strategy-order/layout.tsx에 한 번 배치되는 측정 기준점.
 * - 첫 useEffect 실행 시각 = 이 레이아웃 서브트리의 하이드레이션 커밋 직후 → hydratedAt
 * - Navigation Timing의 loadEventEnd = window load 이벤트 종료 시각 → loadAt
 * - usePathname 변화 = 실제 라우트 이동 → visits
 * 레이아웃은 하위 라우트 이동 중에도 언마운트되지 않으므로 기준점이 한 번만 기록된다.
 */
export function ProbeBootstrap() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.__strategyOrder?.hydratedAt != null) return
    updateProbeStore(() => ({ hydratedAt: performance.now() }))

    function recordLoad() {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      // load 리스너 안에서는 loadEventEnd가 아직 0일 수 있어 한 틱 뒤에 읽는다.
      const read = () => updateProbeStore(() => ({ loadAt: nav && nav.loadEventEnd > 0 ? nav.loadEventEnd : performance.now() }))
      if (nav && nav.loadEventEnd > 0) read()
      else setTimeout(read, 0)
    }
    if (document.readyState === 'complete') recordLoad()
    else window.addEventListener('load', recordLoad, { once: true })
  }, [])

  useEffect(() => {
    const visits = window.__strategyOrder?.visits ?? []
    if (visits[visits.length - 1]?.path === pathname) return
    updateProbeStore((s) => ({ visits: [...s.visits, { path: pathname, at: performance.now() }] }))
  }, [pathname])

  return null
}
