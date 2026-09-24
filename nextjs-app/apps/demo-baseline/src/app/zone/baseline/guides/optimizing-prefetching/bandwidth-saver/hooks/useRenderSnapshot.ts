'use client'

import { useCallback, useEffect, useState } from 'react'
import { getRenderSnapshot } from '../actions'
import type { RenderSnapshot } from '../types'

const POLL_MS = 2000

/** Server Action으로 서버 프로세스의 실제 렌더 카운터를 주기적으로 읽는다. */
export function useRenderSnapshot() {
  const [snapshot, setSnapshot] = useState<RenderSnapshot | null>(null)

  const refresh = useCallback(async () => {
    setSnapshot(await getRenderSnapshot())
  }, [])

  useEffect(() => {
    let active = true
    const tick = async () => {
      if (document.visibilityState !== 'visible') return
      const next = await getRenderSnapshot()
      if (active) setSnapshot(next)
    }
    void tick()
    const id = window.setInterval(tick, POLL_MS)
    return () => {
      active = false
      window.clearInterval(id)
    }
  }, [])

  return { snapshot, refresh }
}
