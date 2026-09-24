'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { useProbes } from './ProbeContext'
import { BASE_PATH, ROUTE_LINKS } from '../types'

/**
 * 실제 Next.js <Link>로 server/[sku], client/[sku] 라우트를 이동하고,
 * 같은 경로에서 쿼리(qty)만 바꾸는 링크를 제공한다. 활성 상태는 실제 URL에서 계산한다.
 */
export function RouteNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clear } = useProbes()

  const query = searchParams.toString()
  const current = query ? `${pathname}?${query}` : pathname
  const onExample = pathname !== BASE_PATH

  const nextQty = new URLSearchParams(query)
  nextQty.set('qty', String(Number(searchParams.get('qty') ?? '0') + 1))

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <nav className="flex flex-wrap gap-2">
          {ROUTE_LINKS.map((link) => {
            const isActive = current === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] font-bold transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          {onExample && (
            <Link
              href={`${pathname}?${nextQty.toString()}`}
              className="rounded-md bg-blue-600 px-2.5 py-1.5 font-mono text-[11px] font-bold text-white hover:bg-blue-700"
            >
              같은 경로에서 쿼리만 변경: qty → {nextQty.get('qty')}
            </Link>
          )}
        </nav>
        <DemoResetButton
          label="기본 경로로 초기화"
          onReset={() => {
            clear()
            router.push(BASE_PATH)
          }}
        />
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-950 px-3.5 py-2 font-mono text-[11px] break-all text-zinc-300 dark:border-zinc-800">
        현재 URL(usePathname + useSearchParams): <span className="text-blue-300">{current}</span>
      </div>
    </div>
  )
}
