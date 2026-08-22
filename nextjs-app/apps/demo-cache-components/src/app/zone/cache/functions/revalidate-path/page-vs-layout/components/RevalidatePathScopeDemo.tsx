'use client'
import React, { useState } from 'react'

export function RevalidatePathScopeDemo() {
  const [scope, setScope] = useState<'page' | 'layout'>('page')

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex gap-2">
        <button type="button" onClick={() => setScope('page')} className={`rounded px-3 py-1 font-bold ${scope === 'page' ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>revalidatePath('/shop', 'page')</button>
        <button type="button" onClick={() => setScope('layout')} className={`rounded px-3 py-1 font-bold ${scope === 'layout' ? 'bg-purple-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>revalidatePath('/shop', 'layout')</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 font-mono">
        {scope === 'page' ? '[확인] 오직 /shop 단일 페이지만 캐시 무효화' : '[확인] /shop 하위의 /shop/101, /shop/102 등 모든 하위 세그먼트 일괄 무효화'}
      </div>
    </div>
  )
}
