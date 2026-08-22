'use client'
import React, { useState } from 'react'

export function CacheLifePresetsDemo() {
  const [profile, setProfile] = useState<'seconds' | 'hours' | 'days'>('hours')

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setProfile('seconds')} className={`rounded px-3 py-1 font-bold ${profile === 'seconds' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}>cacheLife('seconds')</button>
        <button type="button" onClick={() => setProfile('hours')} className={`rounded px-3 py-1 font-bold ${profile === 'hours' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}>cacheLife('hours')</button>
        <button type="button" onClick={() => setProfile('days')} className={`rounded px-3 py-1 font-bold ${profile === 'days' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}>cacheLife('days')</button>
      </div>
      <div className="rounded bg-emerald-50/50 border border-emerald-200 p-3 text-xs dark:bg-emerald-950/20 dark:border-emerald-900 font-mono">
        {profile === 'seconds' && '• stale: 0s | revalidate: 10s | expire: 1m (실시간 주식/재고)'}
        {profile === 'hours' && '• stale: 5m | revalidate: 1h | expire: 1d (상품 상세/카탈로그)'}
        {profile === 'days' && '• stale: 1d | revalidate: 7d | expire: 1y (약관/정적 문서)'}
      </div>
    </div>
  )
}
