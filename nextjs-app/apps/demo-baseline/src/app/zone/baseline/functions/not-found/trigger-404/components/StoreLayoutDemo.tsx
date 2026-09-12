'use client'
import React from 'react'
import Link from 'next/link'
import { TRIGGER_404_BASE_PATH } from '../types'

const LINK_STYLE =
  'block rounded-lg border p-3.5 text-center text-xs font-semibold transition hover:opacity-90'

export function StoreLayoutDemo() {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">매장 지점 상세 (stores/[storeId]/layout.tsx)</h4>
        <p className="text-xs text-zinc-500">
          이 서브 라우트는 <code>page.tsx</code>가 아니라 <code>layout.tsx</code>에서 지점 존재 여부를 검사합니다.
          없는 지점으로 이동하면 layout.tsx가 notFound()를 호출해, 하위 page.tsx까지 통째로 렌더링을 건너뜁니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href={`${TRIGGER_404_BASE_PATH}/stores/STORE-101`}
          className={`${LINK_STYLE} border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300`}
        >
          STORE-101 진입 → (정상)
        </Link>
        <Link
          href={`${TRIGGER_404_BASE_PATH}/stores/STORE-102`}
          className={`${LINK_STYLE} border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300`}
        >
          STORE-102 진입 → (정상)
        </Link>
        <Link
          href={`${TRIGGER_404_BASE_PATH}/stores/STORE-999`}
          className={`${LINK_STYLE} border-amber-300 bg-amber-50/60 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300`}
        >
          STORE-999 진입 → (폐점, 404 유도)
        </Link>
      </div>
    </div>
  )
}
