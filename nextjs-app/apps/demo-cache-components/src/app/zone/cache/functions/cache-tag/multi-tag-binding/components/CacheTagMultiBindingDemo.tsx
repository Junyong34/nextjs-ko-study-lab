'use client'
import React from 'react'

export function CacheTagMultiBindingDemo() {
  const tags = ['products', 'category-electronics', 'brand-logitech', 'item-891']

  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">바인딩된 cacheTag 목록:</div>
      <div className="flex flex-wrap gap-1.5 font-mono">
        {tags.map(t => (
          <span key={t} className="rounded bg-blue-100 px-2 py-0.5 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            #{t}
          </span>
        ))}
      </div>
      <p className="text-zinc-500 text-[11px]">위 태그 중 어느 하나라도 revalidateTag()로 무효화되면 이 캐시가 즉시 폐기됩니다.</p>
    </div>
  )
}
