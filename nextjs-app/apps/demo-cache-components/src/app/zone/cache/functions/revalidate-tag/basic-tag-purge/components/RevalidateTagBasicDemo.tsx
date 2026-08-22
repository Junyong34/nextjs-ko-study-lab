'use client'
import React, { useState } from 'react'

export function RevalidateTagBasicDemo() {
  const [tag, setTag] = useState('inventory')

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">무효화 대상 태그: #{tag}</div>
      <button type="button" onClick={() => setTag('inventory (revalidateTag 호출됨)')} className="rounded bg-zinc-900 px-3.5 py-1.5 font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        revalidateTag('inventory') 실행
      </button>
    </div>
  )
}
