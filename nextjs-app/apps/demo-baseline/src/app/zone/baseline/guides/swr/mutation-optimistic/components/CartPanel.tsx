'use client'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import { CART_KEY, type Recorder } from '../lib/client-api'
import type { Cart } from '../types'

interface Props {
  record: Recorder
  disabled: boolean
  onChange: (cart: Cart, itemId: string, delta: 1 | -1) => void
}

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`
const qtyBtn =
  'h-7 w-7 rounded border border-zinc-300 text-sm font-bold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 cursor-pointer'

/** 장바구니 목록. useSWR(CART_KEY)의 첫 번째 구독자이며, 화면 값이 바뀔 때마다 그 값을 기록한다. */
export function CartPanel({ record, disabled, onChange }: Props) {
  const { data: cart, error, isLoading, isValidating } = useSWR<Cart>(CART_KEY)

  useEffect(() => {
    if (!cart) return
    const qtys = Object.fromEntries(cart.items.map((i) => [i.id, i.qty]))
    const summary = cart.items.map((i) => `${i.name.split(' ').pop()} ${i.qty}`).join(' · ')
    record({
      kind: 'display',
      detail: `화면: ${summary}${cart.optimisticRunId ? ' (낙관적 값)' : ` (서버 v${cart.version})`}`,
      qtys,
      optimistic: cart.optimisticRunId !== undefined,
    })
  }, [cart, record])

  if (error) return <p className="text-xs text-rose-600">장바구니를 불러오지 못했습니다: {String(error.message)}</p>
  if (isLoading || !cart) return <p className="text-xs text-zinc-500">장바구니를 불러오는 중...</p>

  const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800">
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">{item.name}</div>
              <div className="text-[11px] text-zinc-500">
                {won(item.price)} · 재고 {item.stock}개
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className={qtyBtn} disabled={disabled} onClick={() => onChange(cart, item.id, -1)} aria-label={`${item.name} 수량 감소`}>
                -
              </button>
              <span className="w-6 text-center font-mono font-bold tabular-nums">{item.qty}</span>
              <button className={qtyBtn} disabled={disabled} onClick={() => onChange(cart, item.id, 1)} aria-label={`${item.name} 수량 증가`}>
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-zinc-200 px-3 py-2 text-xs dark:border-zinc-800">
        <span className="text-zinc-500">
          {cart.optimisticRunId ? '저장 중 — 서버 응답 전 낙관적 값' : isValidating ? '서버와 재검증 중' : `서버 확정값 v${cart.version}`}
        </span>
        <span className="font-bold text-zinc-900 dark:text-zinc-100">합계 {won(total)}</span>
      </div>
    </div>
  )
}
