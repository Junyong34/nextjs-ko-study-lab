'use client'
import React from 'react'

export function UseSelectedSegmentsBreadcrumbDemo() {
  const segments = ['shop', 'electronics', 'keyboards', 'item-891']

  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">동적 생성 브레드크럼 (useSelectedLayoutSegments):</div>
      <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400">
        <span>home</span>
        {segments.map((seg, idx) => (
          <React.Fragment key={seg}>
            <span>{'>'}</span>
            <span className={idx === segments.length - 1 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}>{seg}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
