'use client'
import React, { useState } from 'react'

export function UseSelectedSegmentDemo() {
  const [segment, setSegment] = useState('overview')
  const tabs = ['overview', 'specs', 'reviews', 'shipping']

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t} type="button" onClick={() => setSegment(t)} className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${segment === t ? 'bg-blue-600 text-white shadow-xs' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        useSelectedLayoutSegment() 리턴값: <strong className="text-blue-600 dark:text-blue-400">"{segment}"</strong>
      </div>
    </div>
  )
}
