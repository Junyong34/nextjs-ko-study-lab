'use client'

import { useCallback, useEffect, useState } from 'react'
import { STATS_URL, type ServerCounts } from '../types'

/** stats/route.ts를 주기적으로 조회해 목적지 layout/page의 실제 서버 렌더 횟수를 가져온다. */
export function useServerCounts(intervalMs = 1500) {
  const [counts, setCounts] = useState<ServerCounts>({})

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(STATS_URL, { cache: 'no-store' })
      if (res.ok) setCounts((await res.json()) as ServerCounts)
    } catch {
      // 네트워크 오류 시 직전 값을 유지한다.
    }
  }, [])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => void refresh(), intervalMs)
    return () => window.clearInterval(timer)
  }, [refresh, intervalMs])

  return counts
}

export async function resetServerCounts() {
  await fetch(STATS_URL, { method: 'POST' })
}
