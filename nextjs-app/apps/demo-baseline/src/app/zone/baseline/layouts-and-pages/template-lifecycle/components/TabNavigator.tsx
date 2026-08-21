'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ProductTab } from '../types'

const BASE_URL = '/zone/baseline/layouts-and-pages/template-lifecycle'

export const PRODUCT_TABS: ProductTab[] = [
  {
    id: 'product-1',
    name: '에어 줌 프로 러닝화',
    href: BASE_URL,
    price: 159000,
    categoryLabel: '신발',
  },
  {
    id: 'product-2',
    name: '오버핏 기모 맨투맨',
    href: `${BASE_URL}/product-2`,
    price: 49000,
    categoryLabel: '의류',
  },
]

export function TabNavigator() {
  const pathname = usePathname()

  return (
    <div className="flex border-b border-zinc-200 dark:border-zinc-800">
      {PRODUCT_TABS.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-medium transition ${
              isActive
                ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
            }`}
          >
            <span>{tab.name}</span>
            <span className="font-mono text-[10px] text-zinc-400">
              ({tab.categoryLabel})
            </span>
          </Link>
        )
      })}
    </div>
  )
}
