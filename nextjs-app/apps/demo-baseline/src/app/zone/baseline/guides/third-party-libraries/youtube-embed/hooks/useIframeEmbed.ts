'use client'
import { useCallback, useEffect, useState } from 'react'
import { isControlPlayer, isLiteRelated, tally } from '../lib/resources'
import type { RequestTally } from '../types'

// 대조군: 일반 <iframe>은 DOM에 붙는 즉시 YouTube 플레이어 문서를 요청한다.
export function useIframeEmbed() {
  const [mountedAt, setMountedAt] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [live, setLive] = useState<RequestTally | null>(null)

  useEffect(() => {
    if (mountedAt === null) return
    const tick = () => setLive(tally(mountedAt, performance.now() + 1, isControlPlayer, isLiteRelated))
    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [mountedAt])

  const mount = useCallback(() => setMountedAt(performance.now()), [])
  const onLoad = useCallback(() => setLoaded(true), [])
  const reset = useCallback(() => {
    setMountedAt(null)
    setLoaded(false)
    setLive(null)
  }, [])

  return { mounted: mountedAt !== null, loaded, live, mount, onLoad, reset }
}

export type IframeEmbedState = ReturnType<typeof useIframeEmbed>
