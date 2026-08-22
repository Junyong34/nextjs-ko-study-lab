'use client'
import React, { useState } from 'react'
export function PrecisionTagPurgeDemo() {
  const [purgedTag, setPurgedTag] = useState('')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">최근 무효화된 태그: {purgedTag || '(없음)'}</div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setPurgedTag('product-101 (키보드만 무효화)')} className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">101번 상품 무효화</button>
        <button type="button" onClick={() => setPurgedTag('category-tech (전자기기 전체 무효화)')} className="rounded bg-purple-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">전자기기 카테고리 무효화</button>
      </div>
    </div>
  )
}
