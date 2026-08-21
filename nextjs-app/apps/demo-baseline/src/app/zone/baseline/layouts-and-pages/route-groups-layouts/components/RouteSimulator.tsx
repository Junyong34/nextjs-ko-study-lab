'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BASE_URL = '/zone/baseline/layouts-and-pages/route-groups-layouts'

const ROUTES = [
  {
    href: `${BASE_URL}/products`,
    title: '상점 상품 카탈로그',
    groupName: '(shop)',
    browserPath: '/products',
  },
  {
    href: `${BASE_URL}/login`,
    title: '회원 로그인 페이지',
    groupName: '(auth)',
    browserPath: '/login',
  },
]

export function RouteSimulator() {
  const pathname = usePathname()

  const currentRoute =
    ROUTES.find((r) => pathname.endsWith(r.browserPath)) || ROUTES[0]

  return (
    <div className="space-y-2.5 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* 브라우저 URL 주소창 */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-300 bg-white px-3 py-2 shadow-2xs dark:border-zinc-700 dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">URL:</span>
          <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
            .../route-groups-layouts{currentRoute.browserPath}
          </span>
        </div>
        <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          Route Group 괄호 폴더명({currentRoute.groupName}) 생략됨
        </span>
      </div>

      {/* 라우트 이동 링크 버튼들 */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Next.js Link 이동:
        </span>
        {ROUTES.map((route) => {
          const isActive = pathname.endsWith(route.browserPath)
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-2xs'
                  : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
              }`}
            >
              {route.title} ({route.browserPath})
            </Link>
          )
        })}
      </div>
    </div>
  )
}
