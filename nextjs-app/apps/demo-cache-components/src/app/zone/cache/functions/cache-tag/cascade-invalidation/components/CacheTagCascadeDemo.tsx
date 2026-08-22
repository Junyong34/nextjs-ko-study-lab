'use client'
import React, { useState } from 'react'

export function CacheTagCascadeDemo() {
  const [status, setStatus] = useState('정상 캐시 중')

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="text-zinc-700 dark:text-zinc-300">상태: <strong className="text-blue-600">{status}</strong></div>
      <button type="button" onClick={() => setStatus('revalidateTag("category-tech") 발동 -> 하위 120개 상품 캐시 일괄 무효화')} className="rounded bg-rose-600 px-3.5 py-1.5 font-bold text-white shadow-2xs cursor-pointer">
        상위 카테고리 태그 연쇄 무효화
      </button>
    </div>
  )
}
