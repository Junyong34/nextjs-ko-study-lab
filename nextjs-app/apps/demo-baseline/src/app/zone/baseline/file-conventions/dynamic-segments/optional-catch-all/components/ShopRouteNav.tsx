'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BASE_PATH, SHOP_ROUTE_CASES, buildShopHref, safeDecode } from '../types'

/**
 * shop/[[...slug]]/page.tsx로 가는 실제 <Link> 목록.
 * 각 href는 세그먼트 원문을 encodeURIComponent로 인코딩해 만든다.
 */
export function ShopRouteNav() {
  const pathname = usePathname()

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SHOP_ROUTE_CASES.map((c) => {
          const href = buildShopHref(c.segments)
          const active = safeDecode(pathname) === safeDecode(href)
          return (
            <Link
              key={c.id}
              href={href}
              className={`block rounded-md border px-3 py-2 transition-colors ${
                active
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-zinc-600'
              }`}
            >
              <span className="block text-xs font-semibold">{c.label}</span>
              <span className="block break-all font-mono text-[10px] opacity-80">
                .../shop{href.slice(`${BASE_PATH}/shop`.length)}
              </span>
            </Link>
          )
        })}
      </div>
      <div className="flex justify-end">
        <Link
          href={BASE_PATH}
          className="rounded px-2 py-1 text-[11px] font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          실습 첫 화면으로
        </Link>
      </div>
    </div>
  )
}
