'use client'
import React, { useEffect, useState } from 'react'

const TIMER_KEY = 'rcb_nav_start'

export function NavTiming() {
  const [elapsedMs, setElapsedMs] = useState<number | null>(null)

  useEffect(() => {
    const start = sessionStorage.getItem(TIMER_KEY)
    if (start) {
      setElapsedMs(Math.round(performance.now() - Number(start)))
      sessionStorage.removeItem(TIMER_KEY)
    }
  }, [])

  if (elapsedMs === null) return null

  return (
    <div className="rounded bg-emerald-50 p-2 text-[11px] font-mono text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
      router.back() 실측 소요 시간: {elapsedMs}ms (performance.now() 기준, 실제 측정값)
    </div>
  )
}
