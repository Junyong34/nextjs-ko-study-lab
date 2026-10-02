'use client'

import { useEffect } from 'react'
import { useStaleTimesLab } from './StaleTimesProvider'
import type { RouteKey } from '../types'

/**
 * 도착한 page가 화면에 커밋되면 측정기에 렌더 ID를 알린다.
 * cacheComponents에서 떠난 page는 <Activity>로 숨겨졌다가 다시 보일 때 effect가 다시 실행되므로 재방문도 감지된다.
 */
export function RenderReporter({ route, renderId }: { route: RouteKey; renderId: string }) {
  const { report } = useStaleTimesLab()
  useEffect(() => {
    report(route, renderId)
  }, [report, route, renderId])
  return null
}
