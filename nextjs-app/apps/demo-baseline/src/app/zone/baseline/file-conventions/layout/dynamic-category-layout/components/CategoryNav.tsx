'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BASE, CATEGORIES, getProducts } from '../catalog'

/** [category] 바깥(정적 layout)에 있는 실제 Link 내비게이션 */
export function CategoryNav() {
  const pathname = usePathname()
  const linkClass = (active: boolean) =>
    `rounded px-2.5 py-1 text-[11px] font-semibold ${
      active ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
    }`

  return (
    <nav aria-label="카테고리 이동" className="min-w-0 space-y-2">
      {CATEGORIES.map((c) => {
        const listHref = `${BASE}/${c.slug}`
        return (
          <div key={c.slug} className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="w-16 shrink-0 text-xs font-bold text-zinc-900 dark:text-zinc-100">{c.label}</span>
            <Link href={listHref} className={linkClass(pathname === listHref)}>
              목록
            </Link>
            <Link href={`${listHref}?sort=price`} className={linkClass(false)}>
              목록 (?sort=price)
            </Link>
            {getProducts(c.slug).map((p) => (
              <Link key={p.id} href={`${listHref}/${p.id}`} className={linkClass(pathname === `${listHref}/${p.id}`)}>
                {p.id}
              </Link>
            ))}
          </div>
        )
      })}
    </nav>
  )
}
