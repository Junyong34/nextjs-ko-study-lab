'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BASE_URL = '/zone/baseline/layouts-and-pages/nested-layouts'

const CATEGORIES = [
  { href: BASE_URL, name: '전체 상품', label: 'All', desc: '전체 카탈로그' },
  { href: `${BASE_URL}/shoes`, name: '신발 (Shoes)', label: 'Shoes', desc: '러닝화 & 스니커즈' },
  { href: `${BASE_URL}/clothing`, name: '의류 (Clothing)', label: 'Clothing', desc: '맨투맨 & 후디' },
  { href: `${BASE_URL}/electronics`, name: '전자기기 (Tech)', label: 'Tech', desc: '스마트워치 & 헤드폰' },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="w-full sm:w-48 shrink-0 border-b sm:border-b-0 sm:border-r border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
        ShopLayout (Next.js Link)
      </div>
      <nav className="flex flex-col gap-1">
        {CATEGORIES.map((cat) => {
          const isActive = pathname === cat.href
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={`flex flex-col items-start rounded px-2.5 py-1.5 text-left text-xs transition ${
                isActive
                  ? 'bg-zinc-900 font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                  : 'text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] ${
                  isActive
                    ? 'text-zinc-300 dark:text-zinc-600'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {cat.desc}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
