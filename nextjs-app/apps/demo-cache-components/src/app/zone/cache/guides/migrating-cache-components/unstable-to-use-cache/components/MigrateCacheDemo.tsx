'use client'
import React, { useState } from 'react'

export function MigrateCacheDemo() {
  const [tab, setTab] = useState<'legacy' | 'modern'>('modern')
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button type="button" onClick={() => setTab('legacy')} className={`rounded px-3 py-1 text-xs font-bold ${tab === 'legacy' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800'}`}>레거시: unstable_cache</button>
        <button type="button" onClick={() => setTab('modern')} className={`rounded px-3 py-1 text-xs font-bold ${tab === 'modern' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800'}`}>모던: 'use cache' (Next 16)</button>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 text-white font-mono text-xs">
        {tab === 'legacy' ? (
          <div>const getCachedData = unstable_cache(async (id) {'=>'} db.get(id), ['product-key'], {'{ tags: ["products"] }'})</div>
        ) : (
          <div className="text-emerald-400">async function getProduct(id) {'{ "use cache"; return db.get(id); }'}</div>
        )}
      </div>
    </div>
  )
}
