import React from 'react'
import Link from 'next/link'

export function InstantNavDemo() {
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2">
        <span className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">현재: 홈 (이 페이지)</span>
        <Link
          href="/zone/baseline/guides/instant-navigation/loading-skeleton/shop"
          className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white cursor-pointer"
        >
          쇼핑몰 진입 (스켈레톤 관찰) →
        </Link>
      </div>
      <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
        클릭하면 실제 shop/loading.tsx 스켈레톤이 뜨고, 1200ms 뒤 실제 카탈로그로 교체됩니다.
      </div>
    </div>
  )
}
