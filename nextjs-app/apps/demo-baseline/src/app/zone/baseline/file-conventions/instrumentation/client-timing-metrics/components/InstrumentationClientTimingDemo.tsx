'use client'
import React from 'react'
export function InstrumentationClientTimingDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">Web Vitals Telemetry:</div>
      <div className="text-emerald-600">• LCP: 620ms (Good)</div>
      <div className="text-emerald-600">• CLS: 0.00 (Good)</div>
      <div className="text-emerald-600">• INP: 45ms (Good)</div>
    </div>
  )
}
