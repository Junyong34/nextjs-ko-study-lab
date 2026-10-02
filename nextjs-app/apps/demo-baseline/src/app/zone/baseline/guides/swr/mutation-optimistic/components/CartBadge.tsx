'use client'
import React from 'react'
import useSWR from 'swr'
import { CART_KEY } from '../lib/client-api'
import type { Cart } from '../types'

/** 같은 키를 읽는 또 다른 구독자. 목록과 별개의 컴포넌트지만 SWR 캐시 칸 하나를 함께 본다. */
export function CartBadge({ label }: { label: string }) {
  const { data: cart } = useSWR<Cart>(CART_KEY)
  const count = cart?.items.reduce((sum, i) => sum + i.qty, 0)
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
      {label}
      <span className={`rounded-full px-1.5 font-mono font-bold ${cart?.optimisticRunId ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'}`}>
        {count ?? '…'}
      </span>
    </span>
  )
}
