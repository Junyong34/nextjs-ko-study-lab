'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { BASE_PATH, INVALID_LINK, PRODUCT_LINKS } from '../types'

/**
 * 실제 Next.js <Link>로 [category]/[id] 다이나믹 세그먼트 라우트를 이동한다.
 * 활성 탭은 useParams()가 반환한 실제 category/id 값과 각 링크를 비교해 결정한다 —
 * 별도의 useState로 "선택된 탭"을 흉내 내지 않는다.
 */
export function ProductLinkNav() {
  const params = useParams<{ category?: string; id?: string }>()
  const router = useRouter()

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <nav className="flex flex-wrap gap-2">
          {PRODUCT_LINKS.map((link) => {
            const isActive = params.category === link.product.category && params.id === link.product.id
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                /{link.product.category}/{link.product.id}
              </Link>
            )
          })}
          <Link
            href={INVALID_LINK.href}
            className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition-all ${
              params.id === 'does-not-exist'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            /electronics/does-not-exist
          </Link>
        </nav>
        <DemoResetButton label="목록으로 초기화" onReset={() => router.push(BASE_PATH)} />
      </div>

      {/* useParams() 실측값 인스펙터 — 시뮬레이션 값 없이 훅의 실제 반환값만 표시 */}
      <div className="rounded border border-zinc-200 bg-zinc-950 px-3.5 py-2 font-mono text-[11px] text-zinc-300 dark:border-zinc-800">
        useParams() 반환값: <span className="text-blue-300">{JSON.stringify(params)}</span>
      </div>
    </div>
  )
}
