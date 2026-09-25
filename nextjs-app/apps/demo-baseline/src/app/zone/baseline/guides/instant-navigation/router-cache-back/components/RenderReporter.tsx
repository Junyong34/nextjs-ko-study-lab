'use client'

import { useLayoutEffect } from 'react'
import { useRouterCacheLab } from './RouterCacheProvider'
import type { ServerRender } from '../types'

/**
 * 서버가 준 렌더 ID가 화면에 커밋되는 순간(paint 직전)을 측정기에 알린다.
 * 뒤로 가기로 복원될 때도 page가 다시 마운트되므로 이 effect가 실행되고,
 * router.refresh()로 새 렌더 ID가 오면 deps가 바뀌어 다시 실행된다.
 */
export function RenderReporter({ route, renderId, renderedAt }: ServerRender) {
  const { report } = useRouterCacheLab()
  useLayoutEffect(() => {
    report({ route, renderId, renderedAt })
  }, [report, route, renderId, renderedAt])
  return null
}
