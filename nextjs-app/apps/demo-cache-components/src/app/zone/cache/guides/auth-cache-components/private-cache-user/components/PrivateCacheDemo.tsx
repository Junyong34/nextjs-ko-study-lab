import React from 'react'
import Link from 'next/link'
import type { UserId } from '../cachedData'

interface PrivateCacheDemoProps {
  userId: UserId
  userName: string
  cacheKey: string
  cacheId: string
  generatedAt: string
  cartItems: { id: string; name: string; price: number; quantity: number }[]
  totalAmount: number
}

const BASE_PATH = '/zone/cache/guides/auth-cache-components/private-cache-user'

export function PrivateCacheDemo({
  userId,
  userName,
  cacheKey,
  cacheId,
  generatedAt,
  cartItems,
  totalAmount,
}: PrivateCacheDemoProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex gap-2">
          <Link
            href={`${BASE_PATH}?user=user_A`}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              userId === 'user_A' ? 'bg-blue-600 text-white shadow-2xs' : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            사용자 A
          </Link>
          <Link
            href={`${BASE_PATH}?user=user_B`}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              userId === 'user_B' ? 'bg-purple-600 text-white shadow-2xs' : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            사용자 B
          </Link>
        </div>
        <div className="text-xs font-mono text-zinc-500">현재 계정: {userName}</div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
          <div className="text-zinc-800 dark:text-zinc-200">
            <span className="font-bold">캐시 태그: </span>
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-blue-600 dark:bg-zinc-900 dark:text-blue-400">{cacheKey}</code>
          </div>
          <span className="text-[11px] text-zinc-400">cacheId: #{cacheId} · {generatedAt}</span>
        </div>

        <div className="space-y-1.5">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded bg-zinc-50 p-2 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800">
              <span>• {item.name} (수량: {item.quantity}개)</span>
              <span className="font-bold">{(item.price * item.quantity).toLocaleString()}원</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between border-t border-zinc-100 pt-2 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <span>총 결제 예정 금액:</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{totalAmount.toLocaleString()}원</span>
        </div>
      </div>
      <p className="text-[11px] text-zinc-500">
        각 링크는 실제 서버 컴포넌트를 다른 userId 인자로 재요청합니다. Next.js가 인자별로 독립된 캐시 항목을 자동 생성하므로 두 사용자의 cacheId가 서로 섞이지 않습니다.
      </p>
    </div>
  )
}
