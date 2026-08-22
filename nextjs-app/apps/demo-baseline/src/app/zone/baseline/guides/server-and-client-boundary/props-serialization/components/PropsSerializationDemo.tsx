'use client'
import React from 'react'
export function PropsSerializationDemo() {
  const data = { id: 'prod-101', name: '스마트워치', price: 350000, tags: ['신상품', '인기'] }
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">// 직렬화되어 전달된 안전한 Props:</div>
      <pre className="text-emerald-600 dark:text-emerald-400">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
