import React from 'react'
import Link from 'next/link'
import { NavTiming } from './NavTiming'

export function RouterCacheBackDemo() {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <NavTiming />
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">실제 3단계 라우트 이동 실습</h4>
        <p className="text-xs text-zinc-500">/catalog(현재) → /product → /checkout으로 실제 이동한 뒤, 각 페이지의 router.back()으로 되돌아오며 실측 소요 시간을 확인하세요.</p>
      </div>
      <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
        <div className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">/catalog (현재 페이지)</div>
        <div className="font-bold text-zinc-900 dark:text-zinc-100">상품 목록</div>
      </div>
      <Link
        href="/zone/baseline/guides/instant-navigation/router-cache-back/product"
        className="inline-block rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
      >
        상품 상세로 이동 →
      </Link>
    </div>
  )
}
