'use client'
import React, { useState } from 'react'
export function MdxCustomSlotDemo() {
  const [added, setAdded] = useState(false)
  return (
    <div className="rounded border border-blue-200 bg-white p-4 shadow-2xs dark:border-blue-900 dark:bg-zinc-950 space-y-2">
      <div className="text-xs font-bold text-blue-950 dark:text-blue-200">MDX 본문 내 주입된 구매 컴포넌트 (&lt;BuyButton /&gt;)</div>
      <button type="button" onClick={() => setAdded(true)} className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs cursor-pointer">
        {added ? '[확인] 장바구니에 담김' : '문서에서 바로 구매하기 (149,000원)'}
      </button>
    </div>
  )
}
