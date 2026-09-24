'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTES, routeHref } from '../routes'

/** 실제 하위 page로 이동하는 <Link>. 이동한 page의 렌더 시각/ID가 아래 {children} 자리에 그려진다. */
export function RouteNav() {
  const pathname = usePathname()

  return (
    <nav className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {ROUTES.map((route) => {
        const href = routeHref(route)
        const active = pathname === href
        return (
          <Link
            key={route.key}
            href={route.key === 'search-params' ? `${href}?q=hello` : href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-md border px-3 py-2 text-left transition-colors ${
              active
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
            }`}
          >
            <span className="block font-mono text-[11px] font-bold">{route.segment}/page.tsx</span>
            <span className={`block text-[10px] ${active ? 'opacity-80' : 'text-zinc-500'}`}>{route.api}</span>
          </Link>
        )
      })}
    </nav>
  )
}
