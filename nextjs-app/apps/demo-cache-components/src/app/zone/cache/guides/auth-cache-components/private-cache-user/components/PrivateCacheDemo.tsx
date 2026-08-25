'use client'

import React, { useState, useTransition } from 'react'
import type { PrivateUserCacheState } from '../types'
import { fetchPrivateUserCacheAction } from '../actions'

export function PrivateCacheDemo() {
  const [data, setData] = useState<PrivateUserCacheState>({
    userId: 'user_A',
    userName: '사용자 A (골드 회원)',
    cacheKey: 'private:session:user_A:cart',
    cartItems: [
      { id: 'item-1', name: '노이즈캔슬링 헤드폰', price: 289000, quantity: 1 },
      { id: 'item-2', name: 'USB-C 멀티 충전기', price: 35000, quantity: 2 },
    ],
    totalAmount: 359000,
    cachedAt: '초기 렌더링',
  })
  const [isPending, startTransition] = useTransition()

  const handleSwitch = (userId: 'user_A' | 'user_B') => {
    startTransition(async () => {
      const res = await fetchPrivateUserCacheAction(userId)
      setData(res)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 상단 사용자 계정 전환 버튼 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSwitch('user_A')}
            disabled={isPending}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              data.userId === 'user_A'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            사용자 A
          </button>
          <button
            type="button"
            onClick={() => handleSwitch('user_B')}
            disabled={isPending}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              data.userId === 'user_B'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            사용자 B
          </button>
        </div>

        <div className="text-xs font-mono text-zinc-500">
          {isPending ? '캐시 키 격리 검증 중...' : `현재 계정: ${data.userName}`}
        </div>
      </div>

      {/* 2. 캐시 격리 결과 뷰어 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
          <div className="text-zinc-800 dark:text-zinc-200">
            <span className="font-bold">캐시 격리 키: </span>
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-blue-600 dark:bg-zinc-900 dark:text-blue-400">
              {data.cacheKey}
            </code>
          </div>
          <span className="text-[11px] text-zinc-400">
            장바구니 {data.cartItems.length}개 캐시됨
          </span>
        </div>

        {/* 장바구니 아이템 목록 */}
        <div className="space-y-1.5">
          {data.cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded bg-zinc-50 p-2 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800"
            >
              <span>• {item.name} (수량: {item.quantity}개)</span>
              <span className="font-bold">{(item.price * item.quantity).toLocaleString()}원</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between border-t border-zinc-100 pt-2 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <span>총 결제 예정 금액:</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{data.totalAmount.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  )
}
