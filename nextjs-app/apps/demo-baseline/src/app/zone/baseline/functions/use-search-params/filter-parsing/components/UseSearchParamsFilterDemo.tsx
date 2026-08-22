'use client'
import React, { useState } from 'react'

export function UseSearchParamsFilterDemo() {
  const [query, setQuery] = useState('sort=popular&brand=apple&minPrice=100000')

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">현재 URL 쿼리스트링: ?{query}</div>
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="rounded bg-zinc-50 p-2 dark:bg-zinc-900">• sort: popular</div>
        <div className="rounded bg-zinc-50 p-2 dark:bg-zinc-900">• brand: apple</div>
        <div className="rounded bg-zinc-50 p-2 dark:bg-zinc-900">• minPrice: 100,000</div>
      </div>
    </div>
  )
}
