'use client'

import { useEffect } from 'react'
import type { PrivateOrderSnapshot, RouteView } from '../types'
import { useObservations } from './ObservationContext'

/**
 * 페이지가 화면에 나타날 때마다(마운트·재표시) 서버가 보낸 private 캐시 값을 기록한다.
 * 브라우저가 메모리에 둔 결과를 다시 쓰면 같은 cacheId가, 서버가 다시 실행하면 새 cacheId가 기록된다.
 */
export function VisitReporter({ route, snapshot }: { route: RouteView; snapshot: PrivateOrderSnapshot }) {
  const { recordVisit } = useObservations()
  useEffect(() => {
    recordVisit({
      route,
      viewer: snapshot.viewer,
      cacheId: snapshot.cacheId,
      generatedAt: snapshot.generatedAt,
      execNoForViewer: snapshot.execNoForViewer,
    })
    // 같은 스냅샷이라도 다시 화면에 나타나면 한 번 더 기록해야 하므로 마운트 기준으로만 실행한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot.cacheId])
  return null
}
