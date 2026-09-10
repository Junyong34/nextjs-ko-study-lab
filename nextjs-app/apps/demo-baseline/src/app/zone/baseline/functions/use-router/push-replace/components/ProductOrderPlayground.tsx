'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { recordNavigation } from '../lib/navigationLog'
import { COMPLETE_PATH, PRODUCT } from '../types'

export function ProductOrderPlayground() {
  const router = useRouter()
  const pathname = usePathname()
  const [historyLength, setHistoryLength] = useState<number | null>(null)

  useEffect(() => {
    setHistoryLength(window.history.length)
  }, [pathname])

  const handleOrder = () => {
    recordNavigation('push', pathname, COMPLETE_PATH)
    router.push(COMPLETE_PATH)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{PRODUCT.name}</h4>
          <p className="text-zinc-500 text-[11px]">{PRODUCT.description}</p>
        </div>
        <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
          {PRODUCT.price.toLocaleString()}원
        </div>
      </div>

      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 font-mono text-[11px] space-y-1">
        <div>
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">현재 URL(usePathname): </span>
          <span className="text-blue-600 dark:text-blue-300">{pathname}</span>
        </div>
        <div>
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">현재 window.history.length: </span>
          <span>{historyLength ?? '측정 중...'}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleOrder}
        className="w-full rounded bg-blue-600 px-3 py-2 text-center font-bold text-white shadow-2xs hover:bg-blue-700 active:scale-[0.99] cursor-pointer"
      >
        주문하기 → router.push(주문 완료)
      </button>
      <p className="text-zinc-500 text-[11px] leading-relaxed">
        클릭하면 <code>router.push()</code>로 주문 완료 화면(<code>/orders/complete</code>)으로 이동합니다. push는
        브라우저 히스토리 스택에 새 엔트리를 추가하므로, 도착 화면의 검증 패널에서{' '}
        <code>history.length</code>가 실제로 1 늘어났는지 확인할 수 있습니다.
      </p>
    </div>
  )
}
