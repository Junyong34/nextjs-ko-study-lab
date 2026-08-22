'use client'
import React from 'react'

export function UseReportWebVitalsDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">useReportWebVitals 수집 결과:</div>
      <div className="text-emerald-600">• LCP (Largest Contentful Paint): 540ms</div>
      <div className="text-emerald-600">• TTFB (Time to First Byte): 85ms</div>
    </div>
  )
}
