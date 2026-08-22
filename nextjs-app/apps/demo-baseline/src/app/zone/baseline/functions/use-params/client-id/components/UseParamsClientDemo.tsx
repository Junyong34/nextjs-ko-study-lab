'use client'
import React, { useState } from 'react'

export function UseParamsClientDemo() {
  const [params, setParams] = useState({ category: 'electronics', id: 'keyboard-900' })

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setParams({ category: 'electronics', id: 'keyboard-900' })} className="rounded bg-blue-600 px-2.5 py-1 text-white font-bold cursor-pointer">/electronics/keyboard-900</button>
        <button type="button" onClick={() => setParams({ category: 'fashion', id: 'hoodie-102' })} className="rounded bg-purple-600 px-2.5 py-1 text-white font-bold cursor-pointer">/fashion/hoodie-102</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono space-y-1">
        <div>const params = useParams();</div>
        <div className="text-emerald-600 dark:text-emerald-400 font-bold">• category: "{params.category}" | id: "{params.id}"</div>
      </div>
    </div>
  )
}
